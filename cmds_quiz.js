
const {User, Quiz, Score} = require("./model.js").models;

const options = { logging: false};const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize("sqlite:db.sqlite", options);

// Show all quizzes in DB including <id> and <author>
/*exports.list = async (rl) =>  {

  let quizzes = await Quiz.findOne(
    {where :  }
  );
  quizzes.forEach( 
    q => rl.log(`  "${q.question}" (by ${q.author.name}, id=${q.id})`)
  );
} */

// Show all quizzes in DB including <id> and <author>
exports.list = async (rl) =>  {

  let quizzes = await Quiz.findAll(
    { include: [{
        model: User,
        as: 'author'
      }]
    }
  );
  quizzes.forEach( 
    q => rl.log(`  "${q.question}" (by ${q.author.name}, id=${q.id})`)
  );
}

// Create quiz with <question> and <answer> in the DB
exports.create = async (rl) => {

  let name = await rl.questionP("Enter user");
    let user = await User.findOne({where: {name}});
    if (!user) throw new Error(`User ('${name}') doesn't exist!`);

    let question = await rl.questionP("Enter question");
    if (!question) throw new Error("Response can't be empty!");

    let answer = await rl.questionP("Enter answer");
    if (!answer) throw new Error("Response can't be empty!");

    await Quiz.create( 
      { question,
        answer, 
        authorId: user.id
      }
    );
    rl.log(`   User ${name} creates quiz: ${question} -> ${answer}`);
}

// Test (play) quiz identified by <id>
exports.test = async (rl) => {

  let id = await rl.questionP("Enter quiz Id");
  let quiz = await Quiz.findByPk(Number(id));
  if (!quiz) throw new Error(`  Quiz '${id}' is not in DB`);

  let answered = await rl.questionP(quiz.question);

  if (answered.toLowerCase().trim()===quiz.answer.toLowerCase().trim()) {
    rl.log(`  The answer "${answered}" is right!`);
  } else {
    rl.log(`  The answer "${answered}" is wrong!`);
  }
}

// Update quiz (identified by <id>) in the DB
exports.update = async (rl) => {

  let id = await rl.questionP("Enter quizId");
  let quiz = await Quiz.findByPk(Number(id));

  let question = await rl.questionP(`Enter question (${quiz.question})`);
  if (!question) throw new Error("Response can't be empty!");

  let answer = await rl.questionP(`Enter answer (${quiz.answer})`);
  if (!answer) throw new Error("Response can't be empty!");

  quiz.question = question;
  quiz.answer = answer;
  await quiz.save({fields: ["question", "answer"]});

  rl.log(`  Quiz ${id} updated to: ${question} -> ${answer}`);
}

// Delete quiz & favourites (with relation: onDelete: 'cascade')
exports.delete = async (rl) => {

  let id = await rl.questionP("Enter quiz Id");
  let n = await Quiz.destroy({where: {id}});
  
  if (n===0) throw new Error(`  ${id} not in DB`);
  rl.log(`  ${id} deleted from DB`);
}



//Funcionalidad play
exports.play = async(rl) => {
  let amountQuizzes = await Quiz.count();
  //console.log('total quizzes ='+ amountQuizzes);
  let score = 0;
  let answeredWrong = false;
  if (!amountQuizzes) throw new Error(`There are no Quizzes available`);
  //Creo un array de enteros que contenga los ID de los quizzes, para ir llevando un registro de los quizzes disponibles
  let quizzesIds = Array.from({ length: amountQuizzes }, (_, index) => index + 1);
  //console.log("quizzes Id ="+ quizzesIds.length);
  //Randomizo sus valorese
  quizzesIds.sort(function() { return 0.5 - Math.random() })
  while (quizzesIds.length !== 0 && !answeredWrong) {
      let quiz = await Quiz.findByPk(Number(quizzesIds[0]));
      let answered = await rl.questionP(quiz.question);

      if (answered.toLowerCase().trim() === quiz.answer.toLowerCase().trim()) {
          rl.log(`  The answer "${answered}" is right!`);
          quizzesIds.shift();
          score++;
      } else {
          rl.log(`  The answer "${answered}" is wrong! \n  Score: ${score}`);
          answeredWrong = true;
      }
  }
  rl.log(`Score: ${score}`);
  let name = await rl.questionP("Enter your name for the highscore");

} 


// Inicio_juego
exports.inicio_juego = async (rl) => {
  let quiz_realizadas=[];
  let quizzes = await Quiz.findAll({order: [sequelize.random()] });
  

  let tot_quizzes =await quizzes.length;
  //console.log( ` Total quizzes dados alta : `+tot_quizzes);

  let score =0;
  //console.log(`Total quizzes Correctas: `+ score );
 
  
  let error_question =false;
  let i=0;
   while (quizzes.length !== 0 && i<tot_quizzes  && !error_question) {
  
    let quiz = await Quiz.findByPk(quizzes[i].id);

    let answered = await rl.questionP(quiz.question);

      
    if (answered.toLowerCase().trim() === quiz.answer.toLowerCase().trim()) {
        rl.log(`  The answer "${answered}" is right!`);
        score++;
        
    } else {
        rl.log(`  The answer "${answered}" is wrong! \n  Score: ${score}`);
        error_question=true;
    }
    i++;
    quiz_realizadas.push(quiz);
    rl.log(`Score:  ${score}`); 

 }
 rl.log(`Score:  ${score}`); 

 
 let name = await rl.questionP("Enter name");
 if (!name) throw new Error("Response can't be empty!");

 let user = await User.findOne({
   where: {name},
});

if (!user) throw new Error(`  '${name}' is not in DB`);

 rl.log(`${user.id}   ${user.name} is ${user.age} years old`);
   let userId =user.id;


 let wins = await rl.questionP("Enter Score");
 if (!wins  ) throw new Error("Response can't be empty!");

 await Score.create( 
   { 
    wins: wins, 
    userId:userId}
 );
 rl.log(`   ${id} de ${user.name} created with ${puntos} puntos`);
}
