"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../config/db.config"));
class ChatMessage extends sequelize_1.Model {
    static associate(models) {
    }
    static initModel(sequelize) {
        ChatMessage.init({
            messageId: {
                type: sequelize_1.DataTypes.UUID,
                primaryKey: true,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
            },
            content: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
            imageUrl: { type: sequelize_1.DataTypes.JSONB, allowNull: true },
            sender: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            receiver: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        }, {
            sequelize: db_config_1.default,
            modelName: "ChatMessage",
            tableName: "ChatMessages",
            timestamps: true,
        });
        return ChatMessage;
    }
}
ChatMessage.initModel(db_config_1.default);
exports.default = ChatMessage;
