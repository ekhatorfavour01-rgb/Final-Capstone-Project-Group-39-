const mongoose = require("mongoose");

const auditDetailsSchema = new mongoose.Schema(
    {
        quantity: Number,
        itemCount: Number,
        totalAmount: Number,
    },
    { _id: false },
);

const auditLogSchema = new mongoose.Schema(
    {
        actor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        action: {
            type: String,
            enum: [
                "user.registered",
                "user.logged_in",
                "cart.item_added",
                "cart.item_updated",
                "cart.item_removed",
                "cart.cleared",
                "order.created",
            ],
            required: true,
        },
        targetType: {
            type: String,
            enum: ["user", "product", "cart", "order"],
            required: true,
        },
        targetId: {
            type: String,
            default: null,
        },
        details: {
            type: auditDetailsSchema,
            default: undefined,
        },
    },
    { timestamps: true },
);

auditLogSchema.index({ actor: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });

module.exports =
    mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);
