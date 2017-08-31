let write = document.querySelector(".write"),
    str = "Hello",
    timer = null;

let log = console.log.bind(console)

function typing() {
    let wstr = [],
        i = -1;

    timer = setInterval(function() {
        i = i + 1
        wstr.push(str[i])
        write.innerText = wstr.join("")

        if (i > str.length - 1) {
            clearInterval(timer)
            deleting()
        }
    }, 500)
}

function deleting() {
    let wstr = str.split(""),
        j = wstr.length;

    timer = setInterval(function() {
        j = j - 1
        wstr = wstr.slice(0, j)
        write.innerText = wstr.join("")

        if (j <= 0) {
            clearInterval(timer)
            typing()
        }
    }, 500)
}

typing()
