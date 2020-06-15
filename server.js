const http = require('http');
const fs = require('fs');
const mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "Логин БД",
    password: "Пароль БД"
  });
let conn_is_it_finished = false; // Текущий запрос в базу данных. сколько угодно может быть в этой сессии
let first_con_db_bool= false; // Если false еще не подключались если true то уже пробовали.Первое и последнее подключение к базе данных в этой сессии.Последнее потомучто мы не можем несколько раз подключаться к базе данных

let html = fs.readFileSync('main.html');
let styles = `<style>${fs.readFileSync('style.css')}</style>`;

let test_obj = { // Что угодно может тут вставлять
    name:'petr',
    age:18,
    is_worked:true,
    city:'Bobruisk'
}
let max_rec = 10;//Количество рекордов показываемых
let a = [];


http.createServer(function(req,res){
    console.log(req.url);
    if(!first_con_db_bool){
        first_con_db();
        first_con_db_bool = true;
    }
        res.write(html);
        res.write(styles);
    if( req.url == '/main' || req.url == '/'){
        res.write(`<h1>Main</h1>`);
        let a = setInterval(function(){
            if(first_con_db_bool){
                res.write(`<a href='/app'>App</a>`);
                res.end();
                clearInterval(a);
            }
        },500);
    }
    if( req.url.includes('/app?')){
        res.write(`<h1>App</h1>`);
        a = [];
        let tmp_1 = '';
        let obj = {};
        for(let i = 0 ;i< req.url.length;i++){
            // console.log(i,tmp_1,a);
            if(req.url[i] == '?'){
                // console.log('start pars');
                tmp_1 = '';
            }
            else if(req.url[i] == '='){
                // a.push(tmp_1);
                obj['attr'] = tmp_1;
                tmp_1 = '';
            }
            else if(req.url[i] == '&'){
                obj['val']= tmp_1;
                a.push(obj);
                tmp_1 = '';
                obj = {};
            }
            else if(i == req.url.length - 1){
                tmp_1 += req.url[i];
                obj['val']= tmp_1;
                a.push(obj);
            }
            else{
                tmp_1 += req.url[i];
            }
        }
        // console.log(a);
        for(let j = 0; j < a.length;j++){
            for(let k in a[j]){
                res.write(`${k} : ${a[j][k]}<br>`);
            }
        }
        db_updt();
        res.write(`<br><a href='/main'>Main</a>`);
        res.end();
    }
    if( req.url == '/app'){
        res.write(`<h1>App</h1>`);
        tables_from_db();
        let a = setInterval(function(){
            console.log('Connection finish?:',conn_is_it_finished);
            if(conn_is_it_finished){
                
                
                clearInterval(a);
                conn_is_it_finished = false;   
                setTimeout(function(){
                    res.write(`<div class = "wrap-forms">`);
                        res.write(`<div class="help_blocks" >`);
                            res.write(`<div class="block add"><p>Add</p></div>`);
                            res.write(`<div class="block change"><p>Change exist</p></div>`);
                        res.write(`</div>`);
                        res.write(`<div class="slider-div add" >`);
                            let form = fs.readFileSync('formadd.html');
                            res.write(form);
                            res.write(`</div>`);

                    // let form = fs.readFileSync('formadd.html');
                        res.write(`<div class="slider-div change" >`);
                            res.write(form);
                            res.write(`</div>`);
                    res.write(`</div>`);
                    res.write(`<br><a href='/main'>Main</a>`);
                    let front = fs.readFileSync('front.js');
                    res.write(`<script>${front}</script>`);
                    res.write(`<div class = 'end'></div>`)
                    res.end();
                },500);
            }
        },500);
        a;
        
    }
    function db_updt(){
        console.log('START UPDATING');
        let black_white = true;
        let tmp_obj = {
            col:[],
            val:[],
            values:'',
            columns:'',
            sql:'',
            updt:'',
            add:''
        }
        for(let i=0; i<a.length-1;i++){
            for(let j in a[i]){
                if(black_white){
                    tmp_obj.col.push(a[i][j]);
                    if(i == a.length -2){
                        tmp_obj.columns += `${a[i][j]}`;
                    }
                    else{
                        tmp_obj.columns += `${a[i][j]},`;
                    }
                    black_white = false;
                }
                else{
                    tmp_obj.val.push(`'${a[i][j]}'`);
                    if(i == a.length -2){
                        tmp_obj.values += `'${a[i][j]}';`;
                    }
                    else{
                        tmp_obj.values += `'${a[i][j]}',`;
                    }
                    black_white = true;
                }
            }
            i == a.length -2? tmp_obj.updt += `${tmp_obj.col[i]} = ${tmp_obj.val[i]}`:tmp_obj.updt += `${tmp_obj.col[i]} = ${tmp_obj.val[i]},`;
        }
        tmp_obj.add = `(${tmp_obj.columns}) VALUES (${tmp_obj.values = tmp_obj.values.slice(0,tmp_obj.values.length-1)});`;
        if(a[a.length-1].attr == 'Change'){
            tmp_obj.sql = `UPDATE sakila.actor SET ${tmp_obj.updt} WHERE actor_id = ${a[0].val};`;
        }
        if(a[a.length-1].attr == 'Add'){
            tmp_obj.sql = `INSERT INTO sakila.actor ${tmp_obj.add}`;
        }
        console.log(tmp_obj);
        con.query(tmp_obj.sql,function(err,result){
            if (err) throw err
            else{
                console.log('ALl is good!');
            }
        });
    }
    function tables_from_db(){
        let sql = `SELECT * FROM sakila.actor`; //WHERE actor_id <= ${max_rec}`;
        let new_tmp_obj = {};
        let one_time = true;
        con.query(sql, function (err, result) {
            for(let i =0 ;i < result.length;i++){
                // console.log(1,i,result[i]);
                for(let k in result[i]){
                    if(one_time){
                        new_tmp_obj[k] = '';
                    }
                    res.write(`<br>${k}  :${result[i][k]}`);
                }
                one_time = false;
                
            }
            add_in_table(new_tmp_obj);
            conn_is_it_finished = true;
        });
    }
    function first_con_db(){
        con.connect(function(err) {
            if (err) throw err;
            res.write("Connected!<br>");
        });
    }
    function add_in_table(obj){
        fs.writeFile('formadd.html','',function(err){
            if(err) throw err
            console.log('saved');
            setTimeout(function(){
                fs.appendFile('formadd.html','<form class = "form" method ="GET">\n',function(err){
                    if(err) throw err
                    console.log('saved');
                });
                setTimeout(function(){
                    for(let i in obj){
                        let form = `<label for="${i}">${i}</label><input id="${i}" name="${i}" value="${obj[i]}"><br>\n`
                        fs.appendFile('formadd.html',form,function(err){
                            if(err) throw err
                            console.log('saved');
                        });
                    }
                    setTimeout(function(){
                        fs.appendFile('formadd.html','<input type="submit" value="send">\n',function(err){
                            if(err) throw err
                            console.log('saved');
                        });
                        setTimeout(function(){
                            fs.appendFile('formadd.html','</form>',function(err){
                                if(err) throw err
                                console.log('saved');
                            });
                        },30);
                    },30);
                },30);
            },30);
        });
    }
}).listen(3000);