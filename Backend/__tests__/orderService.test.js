jest.mock("../Models/Cart", () => ({ findOne: jest.fn() }));
jest.mock("../Models/Order", () => ({ create: jest.fn(), find: jest.fn() }));
jest.mock("../Models/Product", () => ({}));

const Cart = require("../Models/Cart");
const Order = require("../Models/Order");
const { getMyOrders, placeOrder } = require("../Services/orderService");

describe("order service", () => {
    beforeEach(() => jest.clearAllMocks());

    test("places an order using each cart item's price and quantity", async () => {
        const productA = {
            _id: "product-a",
            name: "Item A",
            price: 12.5,
            stock: 8,
            save: jest.fn().mockResolvedValue(undefined),
        };
        const productB = {
            _id: "product-b",
            name: "Item B",
            price: 7,
            stock: 4,
            save: jest.fn().mockResolvedValue(undefined),
        };
        const cart = {
            items: [
                { product: productA, quantity: 2 },
                { product: productB, quantity: 3 },
            ],
            save: jest.fn().mockResolvedValue(undefined),
        };
        Cart.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(cart),
        });
        Order.create.mockImplementation(async (order) => order);

        const order = await placeOrder("user-1", "1 Main Street");

        expect(order.totalAmount).toBe(46);
        expect(order.items).toEqual([
            { product: "product-a", name: "Item A", price: 12.5, quantity: 2 },
            { product: "product-b", name: "Item B", price: 7, quantity: 3 },
        ]);
        expect(productA.stock).toBe(6);
        expect(productB.stock).toBe(1);
        expect(cart.items).toEqual([]);
        expect(Order.create).toHaveBeenCalledWith(
            expect.objectContaining({ totalAmount: 46 }),
        );
    });

    test("returns the API's order array newest first and tolerates missing dates", async () => {
        const orders = [
            { _id: "old", createdAt: "2026-01-01T00:00:00.000Z" },
            { _id: "missing-date" },
            { _id: "new", createdAt: "2026-02-01T00:00:00.000Z" },
            { _id: "invalid-date", createdAt: "not-a-date" },
        ];
        Order.find.mockResolvedValue(orders);

        await expect(getMyOrders("user-1")).resolves.toEqual([
            { _id: "new", createdAt: "2026-02-01T00:00:00.000Z" },
            { _id: "old", createdAt: "2026-01-01T00:00:00.000Z" },
            { _id: "missing-date" },
            { _id: "invalid-date", createdAt: "not-a-date" },
        ]);
    });

    test.each([{ orders: [] }, { orders: [{ _id: "only" }] }])(
        "returns zero or one order without sort errors",
        async ({ orders }) => {
            Order.find.mockResolvedValue(orders);
            await expect(getMyOrders("user-1")).resolves.toEqual(orders);
        },
    );
});
