window.fn = {};

window.fn.open = function(){
    let menu = document.getElementById('menu');
    menu.open();
};

window.fn.load = function(page){
    let content = document.getElementById('content');
    let menu = document.getElementById('menu');
    content.load(page).then(menu.close.bind(menu));
};

document.addEventListener('init', function(event){
    if(event.target.id == 'home'){
        openDb();
        getItems();
    }
});

let db = null;

function openDb(){
    db = openDatabase("ShoppingList", "1", "Shopping List", 1024*1024);
    db.transaction(function(tx){
        tx.executeSql("CREATE TABLE IF NOT EXIST items (ID INTEGER PRIMARY KEY ASC, item TEXT)", []);
    });
}

function onError(tx, e){
    alert("Что-то пошло не так!" + e.Message);
    console.log("Что-то пошло не так!" + e.Message);
}

function getItems(){
    db.transaction(function(tx){
        tx.executeSql("SELECT * FROM items", [], renderItems, onError);
    });
}

function renderItems(tx, rs){
    let output = '';
    let list = document.getElementById('shoppingList');
    for(let i = 0; i < rs.rows.length; i++){
        let row = rs.rows.item(i);
        output += '<ons-list-item>' + row.item + '<div class="right"><ons-button onclick="deleteItem(' + 
        row.ID + ')"><ons-icon icon="trash"></ons-icon></ons-button></div></ons-list-item>';
    }
    list.innerHTML = output;
}

function addItem(){
    let textbox = document.getElementById('item');
    let value = textbox.value;
    if(value.length > 0){
        db.transaction(function(tx){
            tx.executeSql("INSERT INTO items (item) VALUES (?)", [value], onSuccess, onError);
        });
        textbox.value = '';
        fn.load('home.html');
    }
}

function onSuccess(tx, t){
    getItems();
}

function deleteItem(id){
    db.transaction(function(tx){
        tx.executeSql("DELETE FROM items WHERE ID=?", [id], onSuccess, onError);
    });
}