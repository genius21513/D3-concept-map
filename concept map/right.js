
function randomText(d) {
    var arr = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "Sit amet dictum sit amet justo donec enim diam. Nibh ipsum consequat nisl vel. Eget dolor morbi non arcu. Convallis tellus id interdum velit. Pellentesque eu tincidunt tortor aliquam nulla facilisi. Potenti nullam ac tortor vitae purus faucibus ornare suspendisse. Euismod nisi porta lorem mollis aliquam ut porttitor.",
        "Arcu non odio euismod lacinia at quis. Eget arcu dictum varius duis. Sagittis purus sit amet volutpat consequat mauris. Facilisis leo vel fringilla est ullamcorper eget nulla. Quis eleifend quam adipiscing vitae proin sagittis.",
        "Doke kd Arcu non odio euismod lacinia at quis. Eget arcu dictum varius duis. Sagittis purus sit amet volutpat consequat mauris. Facilisis leo vel fringilla est ullamcorper eget nulla. Quis eleifend quam adipiscing vitae proin sagittis."
    ];    
    return arr[d.no % 4];   // just only 4 items, so I use mod.
    // return arr[d.no]; // if you input all lines, use this.
}


function randomImage(d) {
    var arr = [
        "./assets/1.png",
        "./assets/2.png",
        "./assets/3.png",
        "./assets/4.png",
    ];
    return arr[d.no % 4]; // just only 4 items, so I use mod.
    // return arr[d.no]; // if you input all lines, use this.
}

function generateText() {    
    if (data.inner.length < 1) return;

    for (let i = 0; i < data.inner.length; i++) {
        const el = data.inner[i];
        let text = randomText(el);

        let id = 'desc-' + el.id;

        var section = d3.select(".sections")
                .append("div")
                .attr('class', 'section')
                .attr('id', id);

        var ti = section.append('h3')
        .attr('class', 'title')
        .html(el.name);

        var desc = section.append('div')
        .attr('class', 'description')       
        .html(text);

        var desc = section.append('a')
        .attr('href', '#')
        .html(el.name);

        var desc = section.append('div')
        .append('img')
        .attr('src', randomImage(el));
    }
}


function rscroll(d) {
    let xid = 'desc-' + d.id;
    var ele = document.getElementById(xid);
    $('body, html').animate({ scrollTop: $('#' + xid).position().top }, 1000);
    // location.hash = xid;
}


function right_init () {
    generateText();    
    // mouseclick(data.inner[0]);
}

right_init();