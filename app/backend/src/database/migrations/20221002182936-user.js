'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        username: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        role: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      })},

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
