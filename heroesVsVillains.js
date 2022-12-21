window.smoothScroll = function(target) {
    var scrollContainer = target;
    do { //find scroll container
        scrollContainer = scrollContainer.parentNode;
        if (!scrollContainer) return;
        scrollContainer.scrollTop += 1;
    } while (scrollContainer.scrollTop == 0);

    var targetY = 0;
    do { //find the top of target relatively to the container
        if (target == scrollContainer) break;
        targetY += target.offsetTop;
    } while (target = target.offsetParent);

    scroll = function(c, a, b, i) {
        i++; if (i > 30) return;
        c.scrollTop = a + (b - a) / 30 * i;
        setTimeout(function(){ scroll(c, a, b, i); }, 1);
    }
    // start scrolling
    scroll(scrollContainer, scrollContainer.scrollTop, targetY, 0);
}
function heroVsVillainCall(){
    smoothScroll(document.getElementById("battleGround"));
    fetch('https://akabab.github.io/superhero-api/api/all.json')
        .then((r) => r.json())
        .then((response) => {
        showData(response)
        console.log(response)
    }).catch(err => console.error(err));
}            
function removeDiv(){
            
    let heroDiv= document.getElementById("heroDiv");
    let villainDiv= document.getElementById("villainDiv");
    let versusDiv= document.getElementById("versusDiv"); 
    let heroStatsDiv= document.getElementById("heroStatsDiv");
    let villainStatsDiv= document.getElementById("villainStatsDiv");
    let statDescriptionDiv=document.getElementById("statDescriptionDiv");  
    heroDiv.innerHTML="";
    heroStatsDiv.innerHTML="";
    villainStatsDiv.innerHTML="";
    villainDiv.innerHTML="";
    versusDiv.innerText="";
    statDescriptionDiv.innerHTML="";
}
function getWinner (a,b,hero,villain){
    const winnerDiv=document.getElementById("winnerDiv");
    const battleBtn=document.getElementById("battleBtn");
    if (a >= b){
        winnerDiv.innerHTML=hero +" wins "+"\r\n"+a+" to "+b+"!";
        return "hero"

    }else if (a<=b){
        winnerDiv.innerHTML=villain +" wins "+b+" to "+a +"!";
        return "villain"

    }else if (a==b){
        winnerDiv.innerHTML="it was a tie! "+a+ " to "+b
        return "tie"
    }
    battleBtn.addEventListener('click',()=>{
        winnerDiv.innerHTML="";
    })
}
function showData(jsonFormatResponse){

    removeDiv();
    const versus= document.createElement("button");
    const versusDiv= document.getElementById("versusDiv");
    const heroDiv=document.getElementById("heroDiv");
    const villainDiv=document.getElementById("villainDiv");
    const battleBtn= document.getElementById("battleBtn");
    const battleAnalysis= document.getElementById("battleAnalysis");                    
    const battleGround= document.getElementById("battleGround");
         
    versus.className="versus";
    versus.id="versus";
    versus.innerText="VS";
        
    versusDiv.append(versus);

    let heroesContainer = [];
    let villainsContainer = [];
    for(let i in jsonFormatResponse){
        let characterId= jsonFormatResponse[i].biography;
        if (characterId.alignment=="good"){
            heroesContainer.push(jsonFormatResponse[i]);
        }else if(characterId.alignment=="bad"){
            villainsContainer.push(jsonFormatResponse[i]);
        }
    }
            
    let heroGenerator= Math.floor(Math.random()*heroesContainer.length);
    let villainGenerator=Math.floor(Math.random()*villainsContainer.length);
    const heroName=heroesContainer[heroGenerator].name;
    const villainName=villainsContainer[villainGenerator].name;
    if(heroName.length>=15){
        heroDiv.style.cssText="font-size:110%";
        heroDiv.innerHTML=heroName;
    }
    else{
        heroDiv.innerHTML=heroName;
    }
    if (villainName.length>=15){
        villainDiv.style.cssText="font-size:110%";
        villainDiv.innerHTML=villainName;
    }else{
        villainDiv.innerHTML= villainName;
    }
    const heroPic=document.createElement("img");
    const villainPic=document.createElement("img");

    let heroPicIndex=heroesContainer[heroGenerator].images;
    let villainPicIndex=villainsContainer[villainGenerator].images;
            
    heroPic.id="heroPic";
    heroPic.className="heroPic";
    villainPic.id="villainPic";
    villainPic.className="villainPic";

    heroPic.src=heroPicIndex.md;
    villainPic.src=villainPicIndex.md;

    heroDiv.append(heroPic);
    villainDiv.append(villainPic);

    versus.onclick = function() {
        smoothScroll(document.getElementById('matchupData'));
        this.disabled = true;
            const heroStatsDiv= document.getElementById("heroStatsDiv");
            const villainStatsDiv= document.getElementById("villainStatsDiv");
            const statDescriptionDiv=document.getElementById("statDescriptionDiv");
            const heroAnalysis= heroesContainer[heroGenerator].powerstats
            const villainAnalysis= villainsContainer[villainGenerator].powerstats
            const winnerDiv= document.getElementById("winnerDiv");

            let h1=document.createElement("H1");
            h1.innerText=heroesContainer[heroGenerator].name+" vs "+villainsContainer[villainGenerator].name;
            h1.id="matchupTitle";
            h1.className="matchupTitle"
            const winnerBtn=document.createElement("button");
            winnerBtn.className="winnerBtn";
            winnerBtn.innerText="view results";
            battleAnalysis.append(winnerBtn);
            battleAnalysis.append(h1);
            statDescriptionDiv.innerText="intelligence"+"\r\n"+"Strength"+"\r\n"+"Speed"+"\r\n"+"Durability"+"\r\n"+"Power"+"\r\n"+"Combat"+"\r\n";
            battleBtn.addEventListener('click',()=>{
                h1.remove(battleAnalysis);
                 winnerBtn.remove(battleAnalysis);
                 winnerDiv.innerHTML='';
            })
            let heroSum=0;
            let villainSum=0;
            for (let j in heroAnalysis){
                heroStatsDiv.innerText+=heroAnalysis[j]+"\r\n";
                villainStatsDiv.innerText+=villainAnalysis[j]+"\r\n";
                heroSum+=heroAnalysis[j];
                villainSum+=villainAnalysis[j];  
            }
            winnerBtn.addEventListener('click',()=>{
                if(getWinner(heroSum,villainSum,heroName,villainName)=="hero"){
                    winnerDiv.append(heroPic.cloneNode(true));
                }else if(getWinner(heroSum,villainSum,heroName,villainName)=="villain"){
                    
                    winnerDiv.append(villainPic.cloneNode(true));
                };
                smoothScroll(document.getElementById('winnerDiv'));
                let scrollBtn=document.createElement("button");
                scrollBtn.innerText="Play Again!";
                scrollBtn.addEventListener("click", () => {
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    })
                })
                winnerDiv.append(scrollBtn);
                
            })
        }
    }     
    