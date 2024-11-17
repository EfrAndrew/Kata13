const userTable = $('#tbodyAllUserTable');
let editModalForm = document.forms['editModalForm']
let deleteModalForm = document.forms['deleteModalForm']

$(async function () {
    await getAuthUser();
    await getAllUsers();
    addUser();
    editUser();
    deleteUser()
})

async function getUser(id) {
    let response = await fetch('/api/users/' + id)
    return await response.json()
}

async function fillModalForm(form, modal, id) {
    modal.show()
    let user = await getUser(id)
    form.id.value = user.id
    form.roles.value = user.roles[0].id
    form.username.value = user.username
    form.email.value = user.email
    form.password.value = user.password
}

async function fillModalFormDelete(form, modal, id) {
    modal.show()
    let user = await getUser(id)
    form.id.value = user.id
    form.roles.value = user.roles[0].id
    form.username.value = user.username
    form.email.value = user.email
}

async function getAuthUser() {
    fetch("/api/user")
        .then(response => response.json())
        .then(data => {
            $('#authenticatedUsername').append(data.username);
            let roles = data.roles.map(role => ' ' + role.authority.substring(5))
            $('#authenticatedUserRoles').append(roles)
            let user = `$(
                    <tr>
                    <td>${data.id}</td>
                    <td>${data.username}</td>
                    <td>${data.email}</td>
                    <td>${data.roles.map(role => ' ' + role.authority.substring(5))}</td>
                    </tr>`;
            $('#userInfo').append(user);
        })
        .catch(error => console.log(error))
}

async function getAllUsers() {
    userTable.empty();
    fetch('/api/users')
        .then(res => res.json())
        .then(data => {
            data.forEach(user => {
                let tableWithUsers = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.username}</td>
                            <td>${user.email}</td>
                            <td>${user.roles.map(role => ' ' + role.authority.substring(5))}</td>
                            <td>
                                <button type="button" class="btn btn-info"
                                data-bs-toogle="modal"
                                data-bs-target="#editModal"
                                onclick="openEditModal(${user.id})">Edit</button>
                            </td>
                            <td>
                                <button type="button" class="btn btn-danger" 
                                data-toggle="modal"
                                data-bs-target="#deleteModal"
                                onclick="openDeleteModal(${user.id})">Delete</button>
                            </td>
                            
                        </tr>)`
                userTable.append(tableWithUsers);
            })
        }).catch(error => console.log(error))
}

async function openEditModal(id) {
    const modal = new bootstrap.Modal(document.querySelector('#editModal'))
    await fillModalForm(editModalForm, modal, id)
}

function editUser() {
    editModalForm.addEventListener('submit', event => {
        event.preventDefault()
        let editedUserRoles = []
        for (let i = 0; i < editModalForm.roles.options.length; i++) {
            if (editModalForm.roles.options[i].selected) {
                editedUserRoles.push({
                    id: editModalForm.roles.options[i].value,
                    authority: 'ROLE_' + editModalForm.roles.options[i].text
                })
            }
        }
        fetch('/api/users', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: editModalForm.id.value,
                roles: editedUserRoles,
                username: editModalForm.username.value,
                email: editModalForm.email.value,
                password: editModalForm.password.value
            })
        }).then(() => {
            $('#editModalCloseButton').click()
            getAllUsers()
        })
    })
}

async function openDeleteModal(id) {
    const modal = new bootstrap.Modal(document.querySelector('#deleteModal'))
    await fillModalFormDelete(deleteModalForm, modal, id)
    switch (deleteModalForm.roles.value) {
        case '2':
            deleteModalForm.roles.value = 'USER'
            break
        case '1':
            deleteModalForm.roles.value = 'ADMIN'
            break
    }
}

function deleteUser() {
    deleteModalForm.addEventListener("submit", event => {
        event.preventDefault()
        fetch("/api/users/" + deleteModalForm.id.value, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            $('#deleteModalCloseButton').click()
            getAllUsers()
        })
    })
}

