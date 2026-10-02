const AuditLog = require("../Models/AuditLog");

const AUDIT_ACTIONS = [
    "user.registered",
    "user.logged_in",
    "cart.item_added",
    "cart.item_updated",
    "cart.item_removed",
    "cart.cleared",
    "order.created",
];

const recordEvent = async ({
    actorId,
    action,
    targetType,
    targetId,
    details,
}) => {
    try {
        await AuditLog.create({
            actor: actorId,
            action,
            targetType,
            targetId: targetId ? String(targetId) : null,
            details,
        });
        return true;
    } catch (error) {
        console.error("Failed to write audit event:", error.message);
        return false;
    }
};

const listEvents = async ({ page = 1, limit = 25, userId, action } = {}) => {
    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 25, 1), 100);
    const filter = {};

    if (userId) filter.actor = userId;
    if (action) {
        if (!AUDIT_ACTIONS.includes(action)) {
            const error = new Error("Invalid audit action filter.");
            error.statusCode = 400;
            throw error;
        }
        filter.action = action;
    }

    const [events, totalRecords] = await Promise.all([
        AuditLog.find(filter)
            .sort({ createdAt: -1 })
            .skip((currentPage - 1) * pageSize)
            .limit(pageSize),
        AuditLog.countDocuments(filter),
    ]);

    return {
        events,
        pagination: {
            currentPage,
            pageSize,
            totalRecords,
            totalPages: Math.ceil(totalRecords / pageSize),
        },
    };
};

module.exports = { AUDIT_ACTIONS, recordEvent, listEvents };
