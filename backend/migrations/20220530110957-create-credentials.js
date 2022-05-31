'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('credentials', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      platform: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      useremail: {
        type: Sequelize.STRING,
        allowNull: false,
        references: { model: 'users', key: 'email' }
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW

      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    }).then(async () => await queryInterface.addConstraint('credentials', {
      fields: ['useremail', 'platform'],
      type: 'unique',
      name: 'unique_credentials'
    }));;
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('credentials');
  }
};