/* 
    Diese Klasse repräsentiert die Datenstruktur des Kühlschranks.
    Sie sollte per Konstruktor eine Kapazität als Ganzzahl übergeben bekommen. 
    Sollte beim Versuch ein neues Produkt hinzuzufügen das maximal zugelassene Volumen überschritten werden,
    sollte das neue Produkt nicht hinzugefügt werden.
    Zur Vereinfachung ist das Volumen in der imaginären Einheit VU (Volume-Unit) zu behandeln.

    Desweiteren sollte die Klasse über einen Speicher für im Kühlschrank eingelagerte Produkte verfügen.

    Der Kühlschrank-Klasse müssen noch Instanz-Methoden beigefügt werden.
    Folgende Methoden sollten auf jeden Fall enthalten sein:
    - Eine Methode zur Ermittlung der freien Kapazität
    - Eine Methode zur Ermittlung der bereits verbrauchten Kapazität
    - Eine Methode zur Ermittlung der Anzahl eingelagerter Produkte
    - Eine Methode zur Ermittlung des Produktes mit dem kleinsten Volumen   suche kleineste volume
    - Eine Methode zur Ermittlung des Produktes mit dem größten Volumen      suche kleineste volume
    - Eine Methode zum Hinzufügen neuer Produkte
    - Eine Methode zum Entfernen vorhandener Produkte
    - Eine Methode zum Entfernen aller vorhandenen Produkte
    - Eine Methode zum Entfernen aller abgelaufenen Produkte
    - Eine Methode zum Sortieren der Produkte nach Ablaufdatum
*/

// Imports der Produkt Klasse aus der externen Datei
import Product from "./product.js";

// Konstante für einen Tag in Millisekunden
const ONE_DAY = 1000*60*60*24;

class Fridge {
    //  array um die Podukte zu speichern
    products = [];
    // ein Konstrukteur um die kapazität festzulegen
    constructor(capacity) {
        this.capacity = capacity
    }

    // Eine Methode zum Hinzufügen neuer Produkte
    addProduct(product){

        // hier wird getestet ob ausreichend Platz für den neuer Produkt gibt
        if(product.volume <= this.getFreeCapacity()) {

            // Wenn die Bedingung erfüllt ist, wird das Produkt hinzugefügt
            this.products.push(product) 
        }
    } 

      // Eine Methode zur Ermittlung der bereits verbrauchten Kapazität.
    getUsedCapacity(){
        let usedCapacity = 0;
        //  )
        this.products.forEach(product => {
            usedCapacity += product.volume
        })
        return usedCapacity
    }

    //  Eine Methode zur Ermittlung der freien Kapazität.
    getFreeCapacity(){
        let usedCapacity = this.getUsedCapacity();
        // durch die Rechnung wird die gebrauchte Kapazität von der ganzen kapazität abgezogen
        return this.capacity - usedCapacity
    };

    // Eine Methode zur Ermittlung der Anzahl eingelagerter Produkte.
    getProductAmount(){
        //  mit dem 'length' property wird  die anzahl der Produkte zurückgerufen
        return this.products.length
    };

    // Eine Methode zur Ermittlung des Produktes mit dem kleinsten Volumen.
    smallestProductVolume(){
        //wird uns mit der (if) Bedingung einen strich gezeigt, wenn die Kuhlschrank leer ist.
        if(this.products.length === 0) return '-'
        let smallestProductVolume = this.products[0];
        // mit dem array methode (forEach) wird  durch den iterierten Elementen.Volume verglichen
        this.products.forEach(product => {
            if (product.volume < smallestProductVolume.volume) smallestProductVolume = product 
        });
        // wird das kleinsten Volumen der Produkte zurückgerufen
        return smallestProductVolume.name
    };

    // Eine Methode zur Ermittlung des Produktes mit dem größten Volumen.
    biggestProductVolume(){
        //wird uns mit der (if) Bedingung einen strich gezeigt, wenn die Kuhlschrank leer ist.
        if(this.products.length === 0) return '-'
        let beggestProductVolume = this.products[0];
        // mit dem array methode (forEach) wird  durch den iterierten Elementen.Volume verglichen
        this.products.forEach(product => {
            if (product.volume > beggestProductVolume.volume) beggestProductVolume = product
        });
        // wird das größten Volumen der Produkte zurückgerufen
        return beggestProductVolume.name
    };

    // Eine Methode zum Entfernen vorhandener Produkte.
    removeProduct(index){
        // wird durch 'splice' Methode die vorhandene Element entfernt
        this.products.splice(index,1)
       
    };

    // Eine Methode zum Entfernen aller vorhandenen Produkte.
    removeAllProducts(){
        // wird durch 'splice' Methode alle vorhandenen Elemente entfernt
        this.products.splice(0)
    };


     expProducts(){
        // wird mit dem array methode(filter) die anzahl der elemente aufrufen.die aufruf der bedingung erfült haben.
        return this.products.filter(product => {
            let today = new Date();
            // Setzt uhr zeit der Today Objekt auf 00:00 Uhr
            today.setHours(0,0,0,0)
             // Prüft ob die Differenz zwischen das Ablaufdatum und Huete großer als drei Tage ist.
            let difference = today - product.expDate; 
            return (difference / ONE_DAY) > 3
        }).length;
    };

    // Eine Methode zum Entfernen aller abgelaufenen Produkte.
    removeExpProducts(){
        // wird mit dem array methode(filter) die anzahl der elemente aufrufen.die aufruf der bedingung erfült haben.
        this.products = this.products.filter(product => {
            let today = new Date();
            // Setzt uhr zeit der Today Objekt auf 00:00 Uhr
            today.setHours(0,0,0,0)
             // Prüft ob die Differenz zwischen das Ablaufdatum und Huete großer als drei Tage ist.
            let difference = today - product.expDate; 
            return (difference / ONE_DAY) < 3
        })
    };

   //  Eine Methode die uns zeigt die zustand auf dem  die Anzahl der Produkte, die noch ein tag zu .
    untilTomorrowProducts(){
        // ein Variable die neuen Datum speichert.
        let today = new Date().getTime();
        let tomorrow = today + ONE_DAY;
        // wird mit dem array methode(filter) gesucht die elemente die die bedingung erlfült haben.
        return this.products.filter(product => {
            // wird geprüft ob der produkt ablaufdatum größer als Heute und kleiner als Tomorrow.
            if (product.expDate > today && product.expDate < tomorrow )
                {
            return product;
            }
        }).length
        
    };

    //  Eine Methode zum Sortieren der Produkte nach Ablaufdatum.
    sortProducts(){
        
        //  Mit dem 'sort' Methode wird zwischen die Ablaufdatum der zwei Parametern verglichen,
        //  Und wird nach vohrne verschoben, die (parameter) das älters Datum hat. 
        //  Die Ergibnesse wirD mit dem 'return' zurückgerufen.
        
        let sortProducts = this.products.sort((productA, productB)  => { 
            // 
            if ( productA.expDate < productB.expDate) return -1
            // 
            if ( productA.expDate > productB.expDate) return 1
            // 
            return 0
        })
        // 
        return sortProducts
    };

};


export default Fridge;