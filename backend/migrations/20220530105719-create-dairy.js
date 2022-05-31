'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('dairies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING
      },
      useremail: {
        type: Sequelize.STRING,
        allowNull: false,
        references: { model: 'users', key: 'email' }
      },
      date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
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
    }).then(async () => await queryInterface.addConstraint('dairies', {
      fields: ['useremail', 'date'],
      type: 'unique',
      name: 'unique_entry'
    }));
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('dairies');
  }
};