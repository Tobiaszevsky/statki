var assert = require('assert');
const jsdom=require('jsdom');
const Game=require('../scripts/main.js');
const chai=require('chai');
const {JSDOM}=jsdom;
const expect=chai.expect;

let game;
let document;
before(async () =>{
    let htmlFile=await JSDOM.fromFile('./index_v1.html');

    document=htmlFile.window.document;

    game=new Game(document);
});


describe('Przycisk zacznij', () => {
    it('Zaznaczonych statków jest więcej niż 4', () => {
        game.mojeStatki = [1, 2, 3, 4, 5];
        game.KliknieciePrzyciskuZacznij();
        expect(game.mojeStatki.length > 4).to.equal(true);
    })

    it('Ustawianie statków zostało wyłączone', () => {
        expect(game.czyUstawianieStatkow == false).to.equal(true);
    })

    it('Plansza gracza atrybut inert', () => {
        expect(document.getElementById(game.id_plansz[0]).hasAttribute('inert')).to.equal(true);
    })

    it('Plansza przeciwnika nie posiada atrybutu inert', () => {
        expect(document.getElementById(game.id_plansz[1]).hasAttribute('inert')).to.equal(false);
    })

    it('Statki przeciwnika zostały wygenerowane', () => {
        expect(game.statkiPrzeciwnika.length > 0).to.equal(true);
    })

    it('Ilość wygenerowanych statków przeciwnika wynosi więcej niż 10', () => {
        game.statkiPrzeciwnika = [];
        game.WygenerujPozycjeStatkowPrzeciwnika();
        expect(game.statkiPrzeciwnika.length >= 10).to.equal(true);
    })
    })

    describe('Strzał', () => {
    it('Cooldown podczas pierwszego strzału jest wyłączony', () => {
        expect(game.cooldown).to.equal(false);
    })

    it('Kliknięte pole nie zostalo wcześniej użyte', () => {
        expect(!game.used.includes('planszaPrzeciwnika_pole_0_0')).to.equal(true);
    })

    it('Kolor klikniętego pola powinien się zmienić', () => {
        let e = {
            target: {
                id: 'planszaPrzeciwnika_pole_0_0'
            }
        }
        game.Strzal(e);
        expect(document.getElementById('planszaPrzeciwnika_pole_0_0').style.backgroundColor != '').to.equal(true);
    })

    it('Kliknięte pole zostało zapisane do tablicy z użytymi polami', () => {
        expect(game.used.includes('planszaPrzeciwnika_pole_0_0')).to.equal(true);
    })

    it('Cooldown po strzale się włączył', () => {
        expect(game.cooldown).to.equal(true);
    })

    it('Komputer wykonał ruch po 0.5s', () => {
        setTimeout(() => {
            expect(game.computerUsed.length > 0).to.equal(true);
        }, 500);
    })
    })

    describe('Strzał komputera', () => {
    it('Komputer wybrał pole do strzału', () => {
        game.computerUsed = [];
        game.computerTurn();
        setTimeout(() => {
            expect(game.computerUsed.length > 0).to.equal(true);
        }, 500);
    })

    it('Wybrane pole zmieniło kolor', () => {
        setTimeout(() => {
            expect(document.getElementById(game.computerUsed[0]).style.backgroundColor != '').to.equal(true);
        }, 500);
    })

    it('Cooldown został wyłączony', () => {
        setTimeout(() => {
            expect(game.cooldown).to.equal(false);
        }, 500);
    })
    })

    describe('Generowanie id pola', () => {
    it('Wygenerowanie id pola powinno zwrócić mojePole_pole_1_1', () => {
        expect(game.GenerujIdPola('mojePole', 1, 1)).to.equal('mojePole_pole_1_1');
    })
    describe('open',()=>{
        it('Po wygranej/przegranej wyswietla sie komunikat',() =>{
            expect(document.getElementById("popup").classList.contains("open-popup")).to.equal("true");
        })
    })
    describe('close',()=>{
        it('Zamkniecie komunikatu ',() =>{
            expect(document.getElementById("popup").classList.contains("open-popup")).to.equal("false");
        })
    })
})