'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryInterface.createTable('Reviews', {
                reviewId: {
                    allowNull: false,
                    primaryKey: true,
                    type: Sequelize.STRING,
                    defaultValue: Sequelize.UUIDV4,
                },
                rating: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                feedback: {
                    type: Sequelize.STRING,
                },
                userId: {
                    type: Sequelize.STRING,
                    references: {
                        model: "Users",
                        key: "userId"
                    }
                },
                productId: {
                    type: Sequelize.STRING,
                    references: {
                        model: "Products",
                        key: "productId"
                    }
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE
                }
            });
        });
    },
    down(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryInterface.dropTable('Reviews');
        });
    }
};
