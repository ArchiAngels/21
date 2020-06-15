let forms = document.getElementsByTagName('form');
let help = document.getElementsByClassName('help_blocks');
forms[0].removeChild(forms[0].children[0]);
forms[0].removeChild(forms[0].children[0]);
let divs = {
    item:document.getElementsByClassName('slider-div'),
    clickOnFirst:0,
    clickOnSecond:0,
    efect:function(){
        this.clickOnFirst%2?hide(forms[0]):show(forms[0]);
        this.clickOnSecond%2?hide(forms[1]):show(forms[1]);
        divs.clickOnFirst%2 ? divs.item[0].previousSibling.children[0].style.opacity = '0.01':divs.item[0].previousSibling.children[0].style.opacity = '1';
        divs.clickOnSecond%2 ? divs.item[0].previousSibling.children[1].style.opacity = '0.01':divs.item[0].previousSibling.children[1].style.opacity = '1';
    }
};
function hide(n){
    for(let i = 0; i < n.children.length;i++){
        n.children[i].style.display = 'none';
    }
    n.parentElement.style.opacity = '0.1';
}
function show(n){
    for(let i = 0; i < n.children.length;i++){
        n.children[i].style.display = '';
    }
    n.parentElement.style.opacity = '1';
}


window.addEventListener('click',function(event){
    event.target == divs.item[0] || event.target == forms[0] ? divs.clickOnFirst+=1:0;
    event.target == divs.item[1] || event.target == forms[1] ? divs.clickOnSecond+=1:0;
    event.target == forms[0].children[forms[0].children.length -1]? add():0;
    event.target == forms[1].children[forms[1].children.length -1]? change():0;
    divs.efect();
    console.log(event.target,divs.clickOnFirst,divs.clickOnSecond);
})
function add(){
    let d = new Date();
    forms[0].children[forms[0].children.length -3].value == ''?
        forms[0].children[forms[0].children.length -3].value = `${d.getFullYear()}.${d.getMonth()+1 < 10?'0'+(d.getMonth()+1):d.getMonth()+1}.${d.getDate()}`:
        forms[0].children[forms[0].children.length -3].value;
    let child = document.createElement('input');
    child.name = 'Add';
    child.value = 'Yes';
    forms[0].appendChild(child);
}
function change(){
    let d = new Date();
    forms[1].children[forms[1].children.length -3].value == ''?
        forms[1].children[forms[1].children.length -3].value = `${d.getFullYear()}.${d.getMonth()+1 < 10?'0'+(d.getMonth()+1):d.getMonth()+1}.${d.getDate()}`:
        forms[1].children[forms[1].children.length -3].value;
    let child = document.createElement('input');
    child.name = 'Change';
    child.value = 'Yes';
    forms[1].appendChild(child);
    
}