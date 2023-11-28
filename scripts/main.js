
class Game{
    wymiar_tablicy;
    tr;
    td;
    klasa_dla_komorki;
    id_plansz;
    klasa_dla_zaznaczonego_mojego_statku;
    przycisk_zacznij_gre_id;
    popup;
    mojeStatki;
    statkiPrzeciwnika;
    czyUstawianieStatkow;
    cooldown;
    used;
    computerUsed;
    zbite;
    computerZbite;
    document;

    constructor(document){
        this.document=document;
        this.wymiar_tablicy = 10;
        this.tr = 'tr';
        this.td = 'td';
        this.klasa_dla_komorki = 'pole';
        this.id_plansz = ['mojaPlansza', 'planszaPrzeciwnika'];
        this.klasa_dla_zaznaczonego_mojego_statku = 'zaznaczony'

        this.przycisk_zacznij_gre_id = 'zacznijGre'
        this.popup=document.getElementById("popup");
        this.mojeStatki = [];
        this.statkiPrzeciwnika = [];
        this.czyUstawianieStatkow = true;

        this.cooldown = false;

        this.used = [];
        this.computerUsed = [];
        this.zbite = [];
        this.computerZbite = [];
        for(const plansza of this.id_plansz) {
            this.GenerujPlansze(plansza);
        }

        this.przycisk_zacznij_gre = this.document.getElementById(this.przycisk_zacznij_gre_id);


        if (this.przycisk_zacznij_gre) {
            this.przycisk_zacznij_gre.addEventListener('click', this.KliknieciePrzyciskuZacznij)
        }
    }
 GenerujPlansze(id_planszy) {
    const element_w_drzewie_dom = this.document.getElementById(id_planszy);
    
    if (element_w_drzewie_dom) {
        const fragment = this.document.createDocumentFragment();
        for (let iterator = 0; iterator < this.wymiar_tablicy; iterator++) {
            this.GenerujWiersz(fragment, id_planszy, iterator);
        }

        element_w_drzewie_dom.append(fragment);
    }
}

 GenerujWiersz(fragment, id_planszy, wiersz_indeks) {
    const wiersz = this.document.createElement(this.tr);
    for (let iterator = 0; iterator < this.wymiar_tablicy; iterator++) {
        const komorka = this.GenerujKomorke(id_planszy, wiersz_indeks, iterator);
        wiersz.append(komorka);
    }

    fragment.append(wiersz);
}

 GenerujKomorke(id_planszy, wiersz_indeks, kolumna_indeks) {
    const komorka = this.document.createElement(this.td);
    komorka.classList.add(this.klasa_dla_komorki);
    komorka.id = this.GenerujIdPola(id_planszy, wiersz_indeks, kolumna_indeks);
    
    komorka.addEventListener('click', function(event) {
        if (czyUstawianieStatkow) {
            UstawienieStatku(event);
        } else {
            Strzal(event);
        }
    }) 
    return komorka;
}

 GenerujIdPola(id_planszy, wiersz_indeks, kolumna_indeks) {
    return id_planszy + '_' + this.klasa_dla_komorki + '_' + wiersz_indeks + '_' + kolumna_indeks;
}

 UstawienieStatku(event) {
    const id_elementu = event.target.id;
    
    if (mojeStatki.includes(id_elementu)) {
        event.target.classList.remove(klasa_dla_zaznaczonego_mojego_statku);
        const indeks_w_tablicy = mojeStatki.indexOf(id_elementu);
        mojeStatki.splice(indeks_w_tablicy, 1);
    } else {
        event.target.classList.add(klasa_dla_zaznaczonego_mojego_statku);
        mojeStatki.push(id_elementu);
    }
}

 Strzal(event) {
    if(this.cooldown == false){
        if(!this.used.includes(event.target.id)){
            let computer = true;
            if(this.statkiPrzeciwnika.includes(event.target.id)){
                this.document.getElementById(event.target.id).style.backgroundColor = "red";
                zbite.push(event.target.id);
                this.document.getElementById("tekst").innerHTML="TRAFIONY ZATOPIONY";
                if(zbite.length == statkiPrzeciwnika.length){
                    open1("WYGRAŁEŚ");
                }
                computer = false;
            }else{
                this.document.getElementById(event.target.id).style.backgroundColor = "green";
                this.document.getElementById("tekst").innerHTML="PUDŁO";
            }
            this.used.push(event.target.id);
            if(this.computer == true){
                this.cooldown = true;
                computerTurn()
            }
        }
    }
}

 computerTurn(){
    let r1 = Math.floor(Math.random() * 10);
    let r2 = Math.floor(Math.random() * 10);

    let pole = 'mojaPlansza_pole_'+r1+'_'+r2;

    if(this.computerUsed.includes(pole)){
        computerTurn();
    }else{
        setTimeout(() => {
            let comp = true;
            if(this.mojeStatki.includes(pole)){
                this.document.getElementById(pole).style.backgroundColor = 'red';
                this.computerZbite.push(pole);
                this.document.getElementById("tekst").innerHTML="O NIE! PRZECIWNIK TRAFIA W TWÓJ STATEK";
                if(this.computerZbite.length == this.mojeStatki.length){
                    open1("PRZEGRAŁEŚ!");
                }
                comp = false;
                computerTurn();
            }else{
                this.document.getElementById(pole).style.backgroundColor = 'green';
            }
            this.computerUsed.push(pole);
            if(comp == true){
                this.cooldown = false;
            }
        }, 250);
    }
}




 KliknieciePrzyciskuZacznij(event) {
    
    if (this.mojeStatki.length < 5) {
        console.log("Sorry Winnetou, musisz wybrać przynajmniej 5 staktów!");
    } else {
        
        this.czyUstawianieStatkow = false;
        const mojaPlansza = this.document.getElementById(this.id_plansz[0]);
        const planszaPrzeciwnika = this.document.getElementById(this.id_plansz[1]);
        const tekst=this.document.getElementById("tekst");
        tekst.innerHTML="NIECH ZACZNIE SIE BITWA. KLIKAJ W POLA NA PLANSZY PRZECIWNIKA BY WYKONAĆ STRZAŁ";
        planszaPrzeciwnika.style.visibility="visible";

        if (mojaPlansza) {
            mojaPlansza.setAttribute('inert', true);
        }

        if (planszaPrzeciwnika) {
            planszaPrzeciwnika.removeAttribute('inert');
            this.WygenerujPozycjeStatkowPrzeciwnika();
            this.przycisk_zacznij_gre.removeEventListener('click', this.KliknieciePrzyciskuZacznij);
        }
    }
}

 WygenerujPozycjeStatkowPrzeciwnika() {
    const ile_statkow_wygenerowac = parseInt(Math.random() * 10) + 10;

    let iterator = 0;
    
    while (iterator < ile_statkow_wygenerowac)
    {
        const wiersz = parseInt(Math.random() * 9);
        const kolumna = parseInt(Math.random() * 9);
        const id_statku_przeciwnika = `planszaPrzeciwnika_pole_${wiersz}_${kolumna}`;

        if (!this.statkiPrzeciwnika.includes(id_statku_przeciwnika)) {
            this.statkiPrzeciwnika.push(id_statku_przeciwnika);
            ++iterator;
        }
    }
}

 open1(message){
    popup.classList.add("open-popup");
    this.document.getElementById("message").innerHTML=message;
}
 close1(){
    popup.classList.remove("open-popup");
    location.reload();
}
}
module.exports=Game;