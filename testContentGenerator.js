let data = [
    {
        "username": "First User",
        "profilePicture": "profile_pic.png",
        "messages": [
            {
                "sent": true,
                "text": "1st message"
            },
            {
                "sent": true,
                "text": "2nd message"
            },
            {
                "sent": false,
                "text": "3rd message"
            }
        ]
    },
    {
        "username": "Second User",
        "profilePicture": "profile_pic.png",
        "messages": [
            {
                "sent": true,
                "text": "4th message"
            },
            {
                "sent": false,
                "text": "5th message"
            },
            {
                "sent": false,
                "text": "6th message"
            }
        ]
    },
    {
        "username": "Third User",
        "profilePicture": "profile_pic.png",
        "messages": [
            {
                "sent": true,
                "text": "7th message"
            },
            {
                "sent": false,
                "text": "8th message"
            },
            {
                "sent": true,
                "text": "9th message"
            }
        ]
    }
];
console.log(data);

window.onload = function () {
    var messages = document.getElementById("messages");

    var longText = "Text";
    for (var i = 0; i < 50; i++)
        longText += " text";

    messages.appendChild(generateMessage(true, longText));
    messages.appendChild(generateMessage(false, longText));
    messages.appendChild(generateMessage(false, longText));
    for (let i = 0; i < 17; i++)
        messages.appendChild(generateMessage(true, String(i) + "msg"));

    var chatList = document.getElementById("chatlist");
    for (let i = 0; i < 14; i++)
        chatList.appendChild(createUser({
            profilePic: "profile_pic.png",
            username: "user" + i,
            lastMessage: "Message text"
        }));
}

function generateMessage (sent, text) {
    var msg = document.createElement("div");
    msg.classList.add("message_container");
    if (sent)
        msg.classList.add("sent");
    else
        msg.classList.add("received");

    msg.innerHTML = "<p class=\"message\">" + text + "</p>";
    return msg;
}

function createUser (user) {
    let userChat = document.createElement("div");
    userChat.classList.add("chat");

    let profilePic = document.createElement("div");
    profilePic.classList.add("profile_picture");
    profilePic.style.backgroundImage = "url(\"" + user.profilePic + "\");";
    userChat.appendChild(profilePic);

    let username = document.createElement("h2");
    username.classList.add("username");
    username.innerHTML = user.username;
    userChat.appendChild(username);

    let lastMessage = document.createElement("p");
    lastMessage.classList.add("last_message");
    lastMessage.innerHTML = user.lastMessage;
    userChat.appendChild(lastMessage);

    return userChat;
}