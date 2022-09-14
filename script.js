import { dataBase } from "./scriptDb.js"


const loginPage = document.querySelector(".loginPage")
const userPage = document.querySelector(".userPage")

const logInForm = document.querySelector(".logInForm")
const logInBtn = document.querySelector(".logInBtn")
const logOut = document.querySelectorAll(".logOut")

logInForm.addEventListener("submit", function (e) {
    e.preventDefault()
})

// Log In
let thisUser = null

logInBtn.addEventListener("click", function () {
    const emailInput = document.querySelector(".emailInput")
    const passwordInput = document.querySelector(".passwordInput")
    const users = dataBase.users.find(u => {
        return u.email === emailInput.value && passwordInput.value === u.password
    })

    if (users) {
        loginPage.style.display = "none"
        userPage.style.display = "flex"
        thisUser = users
        document.querySelector(".userName").innerHTML = users.name
        getUI()
    }
    else {
        alert("Error")
    }
    emailInput.value = "";
    passwordInput.value = "";
})
// --------------


// LogOut
logOut.forEach(e => {
    e.addEventListener("click", function () {
        loginPage.style.display = "block"
        userPage.style.display = "none"
    })
})
// --------------

const usersHtml = document.querySelector(".users")
let followingBtn = document.querySelectorAll(".followingBtn")

// Pages
const usersRow = document.querySelector(".usersRow")
const notificationsRow = document.querySelector(".notificationsRow")
const followersRow = document.querySelector(".followersRow")
const followingRow = document.querySelector(".followingRow")
// ---------------------

// Button Group
const users_Btn = document.querySelector(".users_Btn")
const following_Btn = document.querySelector(".following_Btn")
const followers_Btn = document.querySelector(".followers_Btn")
const notifications_Btn = document.querySelector(".notifications_Btn")
// ---------------

users_Btn.addEventListener("click", function () {
    notificationsRow.style.display = "none"
    followersRow.style.display = "none"
    followingRow.style.display = "none"
    usersRow.style.display = "block"
})

notifications_Btn.addEventListener("click", function () {
    notificationsRow.style.display = "block"
    usersRow.style.display = "none"
    followersRow.style.display = "none"
    followingRow.style.display = "none"
    getNotification()
})

followers_Btn.addEventListener("click", function () {
    followersRow.style.display = "block"
    followingRow.style.display = "none"
    notificationsRow.style.display = "none"
    usersRow.style.display = "none"
    getFollowers()
})

following_Btn.addEventListener("click", function () {
    followersRow.style.display = "none"
    followingRow.style.display = "block"
    notificationsRow.style.display = "none"
    usersRow.style.display = "none"
    getFollowing()
})


function getUI() {
    usersHtml.innerHTML = ``;
    dataBase.users.forEach(item => {
        if (thisUser.Id != item.Id) {
            let html = `
            <div class="user-list">
                <p>${item.name}</p>
                <button data-user-Id=${item.Id} class="btn btn-primary followingBtn">İzlə</button> 
            </div>
            `
            usersHtml.insertAdjacentHTML("beforeend", html)
        }
    })
    followingBtn = document.querySelectorAll(".followingBtn")
    setNotification(followingBtn)
}

const notificationListHtml = document.querySelector(".notificationListHtml")
let accept = document.querySelectorAll(".accept")

function getNotification() {
    notificationListHtml.innerHTML = ``;
    dataBase.notifications.forEach(item => {
        if (thisUser.Id == item.receive_follow_Id) {
            let button = `<button 
            data-notification-Id=${item.Id} 
            data-notification-accept=${item.isAccept} 
            class="btn btn-primary accept">Qəbul et
        </button>`
            let html = `
            <div class="user-list">
                <p>${dataBase.users.find(e => e.Id == item.sender_follow_Id).name}</p>
                ${item.isAccept ? '' : button}
            </div>
            `
            notificationListHtml.insertAdjacentHTML("beforeend", html)
        }

    })
    accept = document.querySelectorAll(".accept")
    setFollow(accept)
}



function setNotification(followingBtn) {
    followingBtn.forEach(folBtn => {
        folBtn.addEventListener("click", function (e) {
            dataBase.notifications.push(
                {
                    Id: Math.random(),
                    sender_follow_Id: thisUser.Id,
                    receive_follow_Id: +e.target.getAttribute("data-user-Id"),
                    isAccept: false
                }
            )

            e.target.style.display = "none"
        })
    })
}

const followersHtml = document.querySelector(".followersHtml")

function getFollowers() {
    let follewers = []
    followersHtml.innerHTML = ``;
    dataBase.follow.forEach(item => {
        let senderId = dataBase.notifications.find(e => e.Id == item.notifications_Id).sender_follow_Id
        let receiveId = dataBase.notifications.find(e => e.Id == item.notifications_Id).receive_follow_Id
        if (thisUser.Id == receiveId) {
            follewers.push(...dataBase.users.filter(e => e.Id == senderId))
        }
    })
    follewers.forEach(item => {
        let html = `
            <div class="user-list">
                <p>${item.name}</p>
            </div>
            `
        followersHtml.insertAdjacentHTML("beforeend", html)
    })
}

const followingHtml = document.querySelector(".followingHtml")

function getFollowing() {
    let following = []
    followingHtml.innerHTML = ``;
    dataBase.follow.forEach(item => {
        let senderId = dataBase.notifications.find(e => e.Id == item.notifications_Id).sender_follow_Id
        let receiveId = dataBase.notifications.find(e => e.Id == item.notifications_Id).receive_follow_Id
        if (thisUser.Id == senderId) {
            following.push(...dataBase.users.filter(e => e.Id == receiveId))
        }
    })

    following.forEach(item => {
        let html = `
            <div class="user-list">
                <p>${item.name}</p>
            </div>
            `
        followingHtml.insertAdjacentHTML("beforeend", html)
    })
}

function setFollow(accept) {
    let notification = null
    accept.forEach(acceptBtn => {
        acceptBtn.addEventListener("click", function (e) {
            notification = dataBase.notifications.find((item) => item.Id == e.target.getAttribute("data-notification-Id"));
            if (!notification.isAccept) {
                e.target.style.display = "none"
                dataBase.follow.push({
                    Id: Math.random(),
                    notifications_Id: +e.target.getAttribute("data-notification-Id"),
                })
                notification.isAccept = true
            }
        })
    })
}