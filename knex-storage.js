var knex = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: 5432,
        user: 'postgres',
        password: 'p@ssw0rd',
        database: 'postgres'
    }
});



knex.insert({Title: '34wqe'}).into('todos').then(function (id) {
  console.log(id);
}).finally(function() {
  knex.destroy();
});



// knex('todos').where('Id', '5')
//     .update({ Title: 'b5new' }).then(function(count) {
//         console.log(count);
//         knex.select('Id', 'Title', 'Status').from('todos').then(function(a) {
//             console.log(a);
//         });
//     }).finally(function() {
//         knex.destroy();
//     });
