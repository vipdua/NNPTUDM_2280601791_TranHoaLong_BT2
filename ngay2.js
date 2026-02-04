// GETONE lấy 1
// POST tạo mới
// PUT cập nhật 
// PATCH cập nhật một phần
// DELETE xóa
// fetch("https://jsonplaceholder.typicode.com/photos/")
//     .then(
//         function (res) {
//             return res.json();
//         }
//     )
//     .then(
//         function (data) {
//             console.log(data)
//         }
//     )

async function LoadData() {
    let res = await fetch("http://localhost:3000/posts");
    let posts = await res.json();
    let body = document.getElementById("body_table");
    body.innerHTML = '';
    for (const post of posts) {
        let style = post.isDeleted ? "style='text-decoration: line-through; color: gray;'" : "";
        body.innerHTML += `
            <tr ${style}>
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.views}</td>
                <td>
                    ${post.isDeleted ? "" : `<input type="button" value="Delete" onclick="Delete('${post.id}')">`}
                </td>
            </tr>
        `;
    }
}

async function Save() {
    let id = document.getElementById("id_txt").value.trim();
    let title = document.getElementById("title_txt").value;
    let views = document.getElementById("view_txt").value;
    if (id === "") {
        let resAll = await fetch("http://localhost:3000/posts");
        let posts = await resAll.json();

        let maxId = 0;
        for (const p of posts) {
            let num = parseInt(p.id);
            if (num > maxId) maxId = num;
        }

        let newId = (maxId + 1).toString();

        let res = await fetch("http://localhost:3000/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: newId,
                title: title,
                views: views,
                isDeleted: false
            })
        });

        if (res.ok) console.log("Tao moi thanh cong");
    }
    else {
        let res = await fetch("http://localhost:3000/posts/" + id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                views: views
            })
        });

        if (res.ok) {
            console.log("CCap nhat thanh cong");
        } else {
            alert("ID không tồn tại!");
        }
    }

    LoadData();
}


async function Delete(id) {
    let res = await fetch("http://localhost:3000/posts/" + id, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isDeleted: true
        })
    });

    if (res.ok) {
        console.log("Xoa mem thanh cong");
    }
    LoadData();
}

async function LoadComments() {
    let res = await fetch("http://localhost:3000/comments");
    let comments = await res.json();

    let body = document.getElementById("comment_table");
    body.innerHTML = "";

    for (const c of comments) {
        let isDeleted = c.isDeleted === true;

        let style = isDeleted
            ? "style='text-decoration: line-through; color: gray;'"
            : "";

        body.innerHTML += `
            <tr ${style}>
                <td>${c.id}</td>
                <td>${c.postId}</td>
                <td>${c.text}</td>
                <td>
                    ${isDeleted ? "" : `
                        <input type="button" value="Delete" onclick="DeleteComment('${c.id}')">
                    `}
                </td>
            </tr>
        `;
    }
}
LoadComments();

async function SaveComment() {
    let id = document.getElementById("comment_id_txt").value.trim();
    let postId = document.getElementById("comment_postId_txt").value.trim();
    let text = document.getElementById("comment_text_txt").value.trim();

    if (postId === "" || text === "") {
        alert("PostId và nội dung comment không được rỗng");
        return;
    }

    if (id === "") {
        let resAll = await fetch("http://localhost:3000/comments");
        let comments = await resAll.json();

        let maxId = 0;
        for (const c of comments) {
            let num = parseInt(c.id);
            if (num > maxId) maxId = num;
        }

        let newId = (maxId + 1).toString();

        await fetch("http://localhost:3000/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: newId,
                postId: postId,
                text: text,
                isDeleted: false
            })
        });
    }
    else {
        await fetch("http://localhost:3000/comments/" + id, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                postId: postId,
                text: text
            })
        });
    }

    document.getElementById("comment_id_txt").value = "";
    document.getElementById("comment_postId_txt").value = "";
    document.getElementById("comment_text_txt").value = "";

    LoadComments();
}

async function DeleteComment(id) {
    await fetch("http://localhost:3000/comments/" + id, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isDeleted: true
        })
    });
}

function EditComment(id, postId, text) {
    document.getElementById("comment_id_txt").value = id;
    document.getElementById("comment_postId_txt").value = postId;
    document.getElementById("comment_text_txt").value = text;
}

LoadData();
LoadComments();