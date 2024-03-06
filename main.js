/*
C - POST - domain:port/api/v1/products + (data)
R - GET - domain:port/api/v1/products (All)
  - GET - domain:port/api/v1/products/id (get by ID)
U - PUT - domain:port/api/v1/products/id + (data)
D - DELETE - domain:port/api/v1/products/id 
*/

var url = "http://localhost:3000/posts";
var global;

function Load() {
    fetch(url).then(function (res) {
        return res.json();
    }).then(function (posts) {
        global = posts;
        posts.sort(CompareTo);
        var tbody = document.getElementById('tbody');
        tbody.innerHTML = '';
        for (const post of posts) {
            tbody.innerHTML += ConvertFromPostToData(post);
        }
    })
}

function CompareTo(a, b) {
    if (parseInt(a.id) > parseInt(b.id)) {
        return 1;
    }
    return -1;
}

function getMaxID() {
    let ids = global.map(element => element.id);
    return Math.max(...ids);
}
function checkExist(id) {
    let ids = global.map(element => element.id);
    return ids.includes(id + "");
}

function Save() {
    let id = parseInt(document.getElementById('id').value);
    if (isNaN(id)) {
        let newItem = {
            id: (getMaxID() + 1) + "",
            title: document.getElementById('title').value,
            userId: document.getElementById('userid').value,
            body: document.getElementById('body').value,
        }
        Create(newItem);
    }
    else {//id la so
        if (checkExist(id)) {
            let editItem = {
                title: document.getElementById('title').value,
                userId: document.getElementById('userid').value,
                body: document.getElementById('body').value,
            }
            Edit(editItem,id);
        } else {
            let newItem = {
                id: id + "",
                title: document.getElementById('title').value,
                userId: document.getElementById('userid').value,
                body: document.getElementById('body').value,
            }
            Create(newItem);
        }
    }
}
function Edit(data, id) {
    fetch(url+"/"+id, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function () {
        Load();
    })
}

function Create(data) {
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function () {
        Load();
    })
}

function Delete(id) {
    fetch(url + "/" + id, {
        method: 'DELETE'
    }).then(function () {
        Load();
    })
    //return false;
}

function ConvertFromPostToData(post) {
    let string = '<tr>';
    string += '<td>' + post.id + '</td>';
    string += '<td>' + post.userId + '</td>';
    string += '<td>' + post.title + '</td>';
    string += '<td>' + post.body + '</td>';
    string += '<td><button onclick="Delete(' + post.id + ')">Delete</button></td>';
    string += '</tr>';
    return string;
}
