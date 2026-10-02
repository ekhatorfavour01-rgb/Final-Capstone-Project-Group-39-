jest.mock("../Models/AuditLog", () => ({
    create: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
}));

const AuditLog = require("../Models/AuditLog");
const { listEvents, recordEvent } = require("../Services/auditService");

describe("audit service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("writes an event with the safe fields provided by the caller", async () => {
        AuditLog.create.mockResolvedValue({});

        await expect(
            recordEvent({
                actorId: "user-123",
                action: "cart.item_added",
                targetType: "product",
                targetId: "product-456",
                details: { quantity: 2 },
            }),
        ).resolves.toBe(true);

        expect(AuditLog.create).toHaveBeenCalledWith({
            actor: "user-123",
            action: "cart.item_added",
            targetType: "product",
            targetId: "product-456",
            details: { quantity: 2 },
        });
    });

    test("does not fail the completed user action when audit persistence fails", async () => {
        AuditLog.create.mockRejectedValue(new Error("database unavailable"));
        const consoleError = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});

        await expect(
            recordEvent({
                actorId: "user-123",
                action: "user.logged_in",
                targetType: "user",
                targetId: "user-123",
            }),
        ).resolves.toBe(false);

        expect(consoleError).toHaveBeenCalledWith(
            "Failed to write audit event:",
            "database unavailable",
        );
        consoleError.mockRestore();
    });

    test("returns paginated events filtered by actor and action", async () => {
        const events = [{ action: "order.created" }];
        const query = {
            sort: jest.fn(),
            skip: jest.fn(),
            limit: jest.fn(),
        };
        query.sort.mockReturnValue(query);
        query.skip.mockReturnValue(query);
        query.limit.mockResolvedValue(events);
        AuditLog.find.mockReturnValue(query);
        AuditLog.countDocuments.mockResolvedValue(21);

        await expect(
            listEvents({
                page: "2",
                limit: "10",
                userId: "user-123",
                action: "order.created",
            }),
        ).resolves.toEqual({
            events,
            pagination: {
                currentPage: 2,
                pageSize: 10,
                totalRecords: 21,
                totalPages: 3,
            },
        });

        expect(AuditLog.find).toHaveBeenCalledWith({
            actor: "user-123",
            action: "order.created",
        });
        expect(query.skip).toHaveBeenCalledWith(10);
        expect(query.limit).toHaveBeenCalledWith(10);
    });

    test("rejects unsupported action filters", async () => {
        await expect(
            listEvents({ action: "password.revealed" }),
        ).rejects.toMatchObject({
            statusCode: 400,
        });
    });
});
