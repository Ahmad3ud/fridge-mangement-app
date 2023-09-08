/* 
    Dies ist die haupt Javascript Datei, die im HTML eingebunden ist.
    Hierin sollten alle Nutzer-Interaktionen geregelt werden.

    Hierin sollten möglichst keine Datenstrukturdaten gespeichert werden, 
    dafür sind die beiden Klassen 'Fridge' und 'Product' vorgesehen.
    Die nötigen Dateien für die Fridge- und Productklasse sind bereits eingebunden,
    so dass von hier aus von ihnen Gebrauch gemacht werden kann.

    Es empfiehlt sich das Befüllen bzw. Erzeugen der dynamischen GUI Elemente
    in einer größeren Methode zu definieren, die sich an den in der Datenstruktur hinterlegten Daten orientiert.
    So kann man diese Methode bei jeder Änderung der Daten immer wieder aufrufen 
    und muss sich nicht um das Hinzufügen, Ändern oder Entfernen einzelner HTML-Elemente kümmern.

    Die Datei enthält bereits eine Methode zum Erzeugen von Product-Cards.
    Sie liefert das fertige und mit Daten befüllte HTML-Element zurück.

    Außerdem hat Datei einige nötige Referenzen auf HTML-Elemente der GUI.
    Diese können bereits genutzt werden.
    Weitere nötige Referenzen auf HTML-Elemente der GUI können nach demselben Muster per ID-Zugriff gemacht werden.
*/

// Imports der Kühlschrank Klasse aus der externen Datei
import Fridge from "./fridge.js";
// Imports der Produkt Klasse aus der externen Datei
import Product from "./product.js";


/* ----------- HILFSVARIABLEN ----------- */

// Konstante für einen Tag in Millisekunden
const ONE_DAY = 1000*60*60*24;
//  globale Fridge instanz anlegen
let fridge = new Fridge (100);


/* ------------------------------Beispiel Daten --------------------------------- */
fridge.addProduct(new Product ("Tomaten",15,new Date(2022, 9, 31)));
fridge.addProduct(new Product ("Apfel",5,new Date(2022, 9, 29)));
fridge.addProduct(new Product ("Avocado",15,new Date(2022, 9, 30)));
fridge.addProduct(new Product ("Käse",10,new Date(2022, 9, 28)));
fridge.addProduct(new Product ("salami",10,new Date(2022, 10, 2)));
fridge.addProduct(new Product ("Fleisch",25,new Date(2022, 10,3 )));
fridge.addProduct(new Product ("Joghurt",10,new Date(2022, 10, 1)));


////*--------------------------- GUI REFERENZEN -------------------------------*////

// Referenz auf Produkte-Container
const fridgeProductsContainer = document.querySelector('#fridge-products-container');

//! -------------------------- -Produkt Formular-------------------------------------

// Referenz auf Input für  den (Name,Volumen,Aublaufdatum) des neuen Produkts.
const addProductNameInput = document.querySelector('#form-add-product-name');
const addProductVolInput = document.querySelector('#form-add-product-volume');
const addProductExpDateInput = document.querySelector('#form-add-product-exp-date');

 // Referenz auf Butten um das neues Produkt hinzufügen.
const addProductSubmitBtn = document.querySelector('#btn-add-product');

//--funktion für das Formular um neue Produkt hinzufügen-- //
addProductSubmitBtn.addEventListener('click', function (evt) {
    // Bedingung um sicher zu stellen, dass das Produkt Formular kein leren Angaben hat.
    if ((addProductNameInput.value.trim().length > 0) && 
    (addProductVolInput.value.trim().length > 0) && 
    (addProductExpDateInput.value.trim().length > 0))  
    {
        
        //  wird neue objekt erstellt
        let newProduct = new Product(addProductNameInput.value,
            parseInt(addProductVolInput.value),
              new Date(addProductExpDateInput.value)); 
        
        fridge.addProduct(newProduct);
        // wird allgemeine Render-Funktion aufgerufen, um die Datenlage in der GUI widerzuspiegeln
        renderProducts(fridge);
        renderFridgeStatus(fridge);
    } 
});
//! ------------------------linken Panel (Kühlschrank Zustand)--------------------------

// Referenzen auf Spans für die Kühlschrank Zustands.
const fridgeCapacitySpan = document.querySelector("#fridge-capacity-span");
const productsAmountSpan = document.querySelector("#products-amount-span");
const fridgeFreeCapacitySpan = document.querySelector("#fridge-free-capacity-span");
const productsUntilTomorrowSpan = document.querySelector("#products-until-tomorrow-span");
const productsExpiredSpan = document.querySelector("#products-expired-span");
const smallestProductSpan = document.querySelector("#smallest-product-span");
const biggestProductSpan = document.querySelector("#biggest-product-span");

//--Funktion befühlt die kühlschrank Information zustand.--//
function renderFridgeStatus(fridge) {
    fridgeCapacitySpan.innerText = fridge.capacity;
    productsAmountSpan.innerText = fridge.getProductAmount();
    fridgeFreeCapacitySpan.innerText = fridge.getFreeCapacity(); 
    productsUntilTomorrowSpan.innerText = fridge.untilTomorrowProducts();
    productsExpiredSpan.innerText = fridge.expProducts();
    smallestProductSpan.innerText = fridge.smallestProductVolume();
    biggestProductSpan.innerText = fridge.biggestProductVolume();
}
// (renderFridgeStatus) Funktion aufrufen
renderFridgeStatus(fridge);

//! ------------------------Richten Panel (Kühlschrank Controls)--------------------------

// Referenzen auf dem Button(Clean), der die abgelaufenen Produkte im Kühlschrank entfernt.
const sortProductsBtn = document.querySelector("#sort-products-by-exp-date-btn");
// Referenzen auf dem Button(Sort), der nach  das ältere ablaufdatum der Produkte im Kühlschrank sortiert.
const removeAllProductsBtn = document.querySelector("#remove-all-products-btn");
// Referenzen auf dem Button(Defrost), der alle Produkte im Kühlschrank entfernt.
const removeExpProductsBtn = document.querySelector("#clean-fridge-btn");
/* -------------------------------------- */
sortProductsBtn.addEventListener('click',evt => {
    fridge.sortProducts();
    // wird allgemeine Render-Funktion aufgerufen, um die Datenlage in der GUI widerzuspiegeln
    renderProducts(fridge);
    renderFridgeStatus(fridge);
});
removeAllProductsBtn.addEventListener('click',evt => {
    fridge.removeAllProducts();
    // wird allgemeine Render-Funktion aufgerufen, um die Datenlage in der GUI widerzuspiegeln
    renderProducts(fridge);
    renderFridgeStatus(fridge);
});
removeExpProductsBtn.addEventListener('click',evt => {
    fridge.removeExpProducts();
    // wird allgemeine Render-Funktion aufgerufen, um die Datenlage in der GUI widerzuspiegeln
    renderProducts(fridge);
    renderFridgeStatus(fridge);
});




//! ------------------------      Render Produkte----------------------------------------
function renderProducts (fridge) {
    // Entferne alle vorhanden productCards
    fridgeProductsContainer.replaceChildren();
    // Durchlaufe alle products im fridge
    fridge.products.forEach((product, index) => {
        let today = new Date();
        // Setzt uhr zeit der Today Objekt auf 00:00 Uhr
        today.setHours(0,0,0,0);
        // Prüft ob die Differenz zwischen das Ablaufdatum und Huete großer als drei Tage ist.
        let isExp = ((today - product.expDate) / ONE_DAY) > 3;
        // Erstelle neue productCard anhand der Informationen im product
        let productCard = createNewProductCard(product.name, product.volume, product.expDate, isExp, () => {
            fridge.removeProduct(index);
            // wird allgemeine Render-Funktion aufgerufen, um die Datenlage in der GUI widerzuspiegeln
            renderProducts(fridge);
            renderFridgeStatus(fridge);
        });
        // Hänge neu-erzeugte Produkt-Kachel an den Card-Container (Kühlschrank) an
        fridgeProductsContainer.appendChild(productCard);
    } )
}

//! ------------------------      Neuer Produkt erstellen---------------------------------
/* 
    Funktion zum Erstellen einer Produktcard für den Kühlschrank.
    Sie erhält als Parameter
    - Den Namen des Produkts (productName)
    - Das Volumen des Produkts (productVolume), also den Platz, den es innerhalb des Kühlschranks einnimmt
    - Das Ablaufdatum des Produkts (productExpDate)
    - Ein boole'scher Indikator dafür, ob das Produkt abgelaufen ist (isExpired)
    - Eine Callback-Funktion für Behandlung des Klicks auf den Löschknopf der jeweiligen Card (deleteCallback)
        Sollte dieses Callback keiner Funktion entsprechen (oder nicht mitgeliefert werden) erscheint eine Fehlermeldung in der Konsole.

    Als Rückgabewert (return) liefert sie das fertige HTML-Element mit allen übergebenen Informationen.
*/

function createNewProductCard(productName, productVolume, productExpDate, isExpired, deleteCallback) {
    // Erstelle äußeres Card-div
    let card = document.createElement('div');
    // Hänge Bootstrap card-Klasse an
    card.classList.add('card');

    // Erstelle inneres Card-Body-div
    let cardBody = document.createElement('div');
    // Hänge Bootstrap card-body-Klasse an
    cardBody.classList.add('card-body');

    // Erstelle Card Titel
    let cardTitle = document.createElement('h5');
    // Hänge Bootstrap card-title Klasse an
    cardTitle.classList.add('card-title');
    // Fülle Card Titel mit übergebenem Produktnamen
    cardTitle.innerText = productName + ' ';

    // Erstelle Knopf zum Löschen des Produktes
    let deleteCardBtn = document.createElement('button');
    // Setze button-type
    deleteCardBtn.type = 'button';
    // Hänge Bootrap Button Klassen an abhängig davon, ob Produkt bereits abgelaufen oder nicht
    deleteCardBtn.classList.add('btn', 'btn-sm', (isExpired ? 'btn-outline-danger' : 'btn-outline-primary'));

    // Prüfe, ob übergebenes Callback für den Löschknopf gültig ist
    if (typeof deleteCallback === 'function') {
        // Hänge übergebenes Callback auf das onClick-Event des Löschknopfs an
        deleteCardBtn.addEventListener('click', evt => {
            deleteCallback();
        });

    } else {
        // Gebe aus, dass übergebenes Callback ungültig ist
        console.log('%cDas mitgelieferte Callback zum Löschen des Produkts ist keine Funktion oder nicht vorhanden.', 'color: red;');
    }

    // Erstelle icon-Element für Löschknopf
    let deleteCardBtnIcon = document.createElement('i');
    // Hänge dem icon-Element abhängig von Ablaufszustand die entsprechende Bootstrap Klasse an
    deleteCardBtnIcon.classList.add('fa-solid', (isExpired ? 'fa-trash' : 'fa-utensils'));

    // Erstelle Untertitel Element
    let cardSubTitle = document.createElement('h6');
    // Hänge Bootstrap card-subtitle Klasse an Untertitel Element an
    cardSubTitle.classList.add('card-subtitle', 'mb-2', 'text-muted');

    // Wenn abgelaufen, ersetze Bootstrap Klasse für Textfarbe
    if (isExpired) cardSubTitle.classList.replace('text-muted', 'text-danger');
    // Wenn kurz vor Ablauf, ersetze Bootstrap Klasse für Textfarbe
    else if (new Date(productExpDate) - new Date() < ONE_DAY) cardSubTitle.classList.replace('text-muted', 'text-warning');
    // Befülle Untertitel Element mit übergebenem Ablaufsdatum
    cardSubTitle.innerText = productExpDate.toLocaleDateString('de-DE');

    // Erstelle Text-Element für Produkt-Volumen
    let cardText = document.createElement('p');
    // Hänge Bootstrap card-text Klasse an Text-Element an
    cardText.classList.add('card-text');
    
    // Befülle Text-Element mit übergebenem Produktvolumen
    cardText.innerText = productVolume + " VU";

    // Hänge Lösch-Icon an Löschknopf an
    deleteCardBtn.appendChild(deleteCardBtnIcon);
    // Hänge Löschknopf an Card Titel an
    cardTitle.appendChild(deleteCardBtn);

    // Hänge Card Titel an Card-Body an
    cardBody.appendChild(cardTitle);
    // Hänge Card Untertiel an Card-Body an
    cardBody.appendChild(cardSubTitle);
    // Hänge Card Text an Card-Body an
    cardBody.appendChild(cardText);
    
    // Hänge Card-Body an Card-div an
    card.appendChild(cardBody);

    // Gebe fertige Klasse zurück
    return card;
}

renderProducts(fridge);