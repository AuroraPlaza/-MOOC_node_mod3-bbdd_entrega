
const {User, Score, Quiz} = require("./model.js").models;

const options = { logging: false};const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize("sqlite:db.sqlite", options);


// Show all users in DB
exports.list = async (rl) => {

   let scores = await Score.findAll({
       include: [{ model: User, as: 'scores' }]
});
   
   scores.forEach( u => rl.log(`  ID: ${u.id}  - Puntos ${u.wins} son de  ${u.scores.name}   el Autor`));
 }

 // Create Score de un Usuario in the DB
exports.create = async (rl) => {


  let name = await rl.questionP("Enter name");
  if (!name) throw new Error("Response can't be empty!");

  let user = await User.findOne({
    where: {name},
});

if (!user) throw new Error(`  '${name}' is not in DB`);

  rl.log(`${user.id}   ${user.name} is ${user.age} years old`);
    let ui =user.id;


  let puntos = await rl.questionP("Enter Score");
  if (!puntos) throw new Error("Response can't be empty!");

  await Score.create( 
    { ui, puntos }
  );
  rl.log(`   ${id} de ${user.name} created with ${puntos} puntos`);
}
