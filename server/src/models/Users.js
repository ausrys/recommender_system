module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
        user_id : {
            type : DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true,

        },
        email : {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password : {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })
    return Users
};