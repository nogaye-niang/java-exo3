
"use strict";

// =====================================
// 1. TABLEAU DE 15 PRODUITS
// =====================================

let produits = [
    { id: 1, nom: "Ordinateur HP", categorie: "Informatique", prix: 350000, quantite: 12, ventes: 25, actif: true },
    { id: 2, nom: "Souris sans fil", categorie: "Accessoires", prix: 8000, quantite: 3, ventes: 80, actif: true },
    { id: 3, nom: "Clavier mécanique", categorie: "Accessoires", prix: 25000, quantite: 15, ventes: 45, actif: true },
    { id: 4, nom: "Écran Samsung", categorie: "Informatique", prix: 150000, quantite: 4, ventes: 32, actif: true },
    { id: 5, nom: "Téléphone Samsung", categorie: "Téléphonie", prix: 220000, quantite: 20, ventes: 60, actif: true },
    { id: 6, nom: "Casque Bluetooth", categorie: "Accessoires", prix: 18000, quantite: 8, ventes: 55, actif: true },
    { id: 7, nom: "Imprimante Canon", categorie: "Informatique", prix: 95000, quantite: 2, ventes: 18, actif: true },
    { id: 8, nom: "Disque dur externe", categorie: "Stockage", prix: 45000, quantite: 10, ventes: 40, actif: true },
    { id: 9, nom: "Clé USB 64 Go", categorie: "Stockage", prix: 7000, quantite: 30, ventes: 100, actif: true },
    { id: 10, nom: "Webcam HD", categorie: "Accessoires", prix: 22000, quantite: 0, ventes: 28, actif: true },
    { id: 11, nom: "Tablette Lenovo", categorie: "Téléphonie", prix: 125000, quantite: 6, ventes: 22, actif: true },
    { id: 12, nom: "Routeur Wi-Fi", categorie: "Réseau", prix: 30000, quantite: 14, ventes: 35, actif: true },
    { id: 13, nom: "Câble HDMI", categorie: "Accessoires", prix: 5000, quantite: 2, ventes: 70, actif: true },
    { id: 14, nom: "SSD 1 To", categorie: "Stockage", prix: 65000, quantite: 9, ventes: 38, actif: true },
    { id: 15, nom: "Ordinateur Dell", categorie: "Informatique", prix: 400000, quantite: 7, ventes: 20, actif: false }
];

// =====================================
// 2. OUTILS
// =====================================

const $ = id => document.getElementById(id);

const nombre = n =>
    new Intl.NumberFormat("fr-FR").format(n);

const prixFCFA = n => nombre(n) + " FCFA";

function cellule(ligne, texte) {
    const td = document.createElement("td");
    td.textContent = texte;
    ligne.appendChild(td);
    return td;
}

function listeHTML(id, elements, messageVide) {
    const liste = $(id);
    liste.replaceChildren();

    if (elements.length === 0) {
        const li = document.createElement("li");
        li.className = "empty";
        li.textContent = messageVide;
        liste.appendChild(li);
        return;
    }

    elements.forEach(texte => {
        const li = document.createElement("li");
        li.textContent = texte;
        liste.appendChild(li);
    });
}

function bouton(texte, classe, action) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn btn-small " + classe;
    b.textContent = texte;
    b.addEventListener("click", action);
    return b;
}

// =====================================
// 3. RECHERCHE ET FILTRAGE
// =====================================

function filtrerProduits() {
    const recherche = $("recherche").value
        .trim()
        .toLocaleLowerCase("fr");

    const categorie = $("filtreCategorie").value;
    const disponibilite = $("filtreDisponibilite").value;

    // filter() crée un nouveau tableau.
    // Le tableau produits n'est pas modifié.
    return produits.filter(p => {
        const nomCorrespond = p.nom
            .toLocaleLowerCase("fr")
            .includes(recherche);

        const categorieCorrespond =
            !categorie || p.categorie === categorie;

        const disponible = p.actif && p.quantite > 0;

        const disponibiliteCorrespond =
            !disponibilite ||
            (disponibilite === "disponible" && disponible) ||
            (disponibilite === "indisponible" && !disponible);

        return nomCorrespond &&
            categorieCorrespond &&
            disponibiliteCorrespond;
    });
}

function actualiserCategories() {
    const select = $("filtreCategorie");
    const ancienneValeur = select.value;

    select.replaceChildren();

    const optionToutes = document.createElement("option");
    optionToutes.value = "";
    optionToutes.textContent = "Toutes les catégories";
    select.appendChild(optionToutes);

    const categories = [...new Set(
        produits.map(p => p.categorie)
    )].sort((a, b) => a.localeCompare(b, "fr"));

    categories.forEach(categorie => {
        const option = document.createElement("option");
        option.value = categorie;
        option.textContent = categorie;
        select.appendChild(option);
    });

    if (categories.includes(ancienneValeur)) {
        select.value = ancienneValeur;
    }
}

// =====================================
// 4. AFFICHAGE DU CATALOGUE
// =====================================

function afficherProduits() {
    const tbody = $("tableProduits");
    tbody.replaceChildren();

    const resultat = filtrerProduits();

    $("resultats").textContent =
        `${resultat.length} produit(s) affiché(s) sur ${produits.length}.`;

    resultat.forEach(p => {
        const tr = document.createElement("tr");

        cellule(tr, p.id);
        cellule(tr, p.nom);
        cellule(tr, p.categorie);
        cellule(tr, prixFCFA(p.prix));
        cellule(tr, p.quantite);
        cellule(tr, p.ventes);

        // Chiffre d'affaires théorique = prix x ventes.
        cellule(tr, prixFCFA(p.prix * p.ventes));

        const tdEtat = cellule(tr, "");
        const badge = document.createElement("span");
        badge.className = "badge";

        if (!p.actif) {
            badge.classList.add("badge-danger");
            badge.textContent = "Désactivé";
        } else if (p.quantite === 0) {
            badge.classList.add("badge-danger");
            badge.textContent = "Rupture";
        } else if (p.quantite < 5) {
            badge.classList.add("badge-warning");
            badge.textContent = "Stock faible";
        } else {
            badge.classList.add("badge-success");
            badge.textContent = "Disponible";
        }

        tdEtat.appendChild(badge);

        const tdActions = cellule(tr, "");

        tdActions.appendChild(bouton(
            "Modifier", "btn-edit", () => modifierProduit(p.id)
        ));

        if (p.actif) {
            tdActions.appendChild(bouton(
                "Désactiver", "btn-disable",
                () => desactiverProduit(p.id)
            ));
        }

        tbody.appendChild(tr);
    });

    if (resultat.length === 0) {
        const tr = document.createElement("tr");
        const td = cellule(tr, "Aucun produit trouvé.");
        td.colSpan = 9;
        td.className = "empty";
        tbody.appendChild(tr);
    }
}

// =====================================
// 5. ANALYSE DES DONNEES
// =====================================

function calculerStatistiques() {
    const valeurStock = produits.reduce(
        (total, p) => total + p.prix * p.quantite,
        0
    );

    const totalVentes = produits.reduce(
        (total, p) => total + p.ventes,
        0
    );

    $("totalProduits").textContent = produits.length;
    $("valeurStock").textContent = prixFCFA(valeurStock);
    $("totalVentes").textContent = nombre(totalVentes);
}

function afficherTopVentes() {
    // Copie du tableau avant le tri.
    const top3 = [...produits]
        .sort((a, b) => b.ventes - a.ventes)
        .slice(0, 3)
        .map(p => `${p.nom} : ${nombre(p.ventes)} ventes`);

    listeHTML("topVentes", top3, "Aucune vente enregistrée.");
}

function afficherStockParCategorie() {
    const groupes = produits.reduce((acc, p) => {
        if (!acc[p.categorie]) {
            acc[p.categorie] = {
                nombre: 0,
                valeurStock: 0
            };
        }

        acc[p.categorie].nombre++;
        acc[p.categorie].valeurStock += p.prix * p.quantite;

        return acc;
    }, {});

    const tbody = $("tableCategories");
    tbody.replaceChildren();

    Object.entries(groupes)
        .sort(([a], [b]) => a.localeCompare(b, "fr"))
        .forEach(([categorie, infos]) => {
            const tr = document.createElement("tr");

            cellule(tr, categorie);
            cellule(tr, infos.nombre);
            cellule(tr, prixFCFA(infos.valeurStock));

            tbody.appendChild(tr);
        });
}

// =====================================
// 6. DETECTION DES ANOMALIES
// =====================================

function detecterAnomalies() {
    // Produits ayant un stock inférieur à 5.
    const stocksFaibles = produits.filter(
        p => p.quantite < 5
    );

    $("stocksFaibles").textContent = stocksFaibles.length;

    listeHTML(
        "listeStocksFaibles",
        stocksFaibles.map(p =>
            `${p.nom} : ${p.quantite} unité(s)`
        ),
        "Aucun stock inférieur à 5."
    );

    // Réapprovisionner les produits actifs dont le stock
    // est inférieur à 5.
    const reapprovisionnement = produits.filter(
        p => p.actif && p.quantite < 5
    );

    listeHTML(
        "listeReapprovisionnement",
        reapprovisionnement.map(p =>
            `${p.nom} : stock actuel ${p.quantite}`
        ),
        "Aucun réapprovisionnement nécessaire."
    );

    // Compter les occurrences de chaque identifiant.
    const compteIds = produits.reduce((acc, p) => {
        acc[p.id] = (acc[p.id] || 0) + 1;
        return acc;
    }, {});

    const doublons = Object.entries(compteIds)
        .filter(([, nombreOccurrences]) => nombreOccurrences > 1)
        .map(([id, nombreOccurrences]) =>
            `ID ${id} apparaît ${nombreOccurrences} fois`
        );

    listeHTML(
        "listeDoublons",
        doublons,
        "Aucun identifiant en double."
    );
}

// =====================================
// 7. IDENTIFIANT UNIQUE
// =====================================

function genererIdUnique() {
    // Trouve le plus petit entier positif disponible.
    let id = 1;

    while (produits.some(p => p.id === id)) {
        id++;
    }

    return id;
}

// =====================================
// 8. AJOUTER UN PRODUIT
// =====================================

function ajouterProduit(donnees) {
    const nouveauProduit = {
        id: genererIdUnique(),
        ...donnees
    };

    // Nouveau tableau : pas de push() sur le tableau original.
    produits = [...produits, nouveauProduit];

    actualiserCategories();
    actualiserAffichage();
}

// =====================================
// 9. MODIFIER UN PRODUIT
// =====================================

function modifierProduit(id) {
    const p = produits.find(produit => produit.id === id);

    if (!p) {
        afficherMessage("Produit introuvable.", true);
        return;
    }

    $("titreFormulaire").textContent = "Modifier un produit";
    $("produitId").value = p.id;
    $("nom").value = p.nom;
    $("categorie").value = p.categorie;
    $("prix").value = p.prix;
    $("quantite").value = p.quantite;
    $("ventes").value = p.ventes;
    $("actif").checked = p.actif;
    $("messageFormulaire").textContent = "";

    $("formulairePanel").hidden = false;

    $("formulairePanel").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// =====================================
// 10. DESACTIVER UN PRODUIT
// =====================================

function desactiverProduit(id) {
    const p = produits.find(produit => produit.id === id);

    if (!p || !p.actif) return;

    if (!confirm(`Désactiver le produit "${p.nom}" ?`)) {
        return;
    }

    // map() crée un nouveau tableau et un nouvel objet
    // pour le produit modifié.
    produits = produits.map(produit =>
        produit.id === id
            ? { ...produit, actif: false }
            : produit
    );

    actualiserAffichage();
}

// =====================================
// 11. VALIDATION DU FORMULAIRE
// =====================================

function afficherMessage(texte, erreur = false) {
    const message = $("messageFormulaire");
    message.textContent = texte;
    message.style.color = erreur ? "#b91c1c" : "#15803d";
}

$("formProduit").addEventListener("submit", event => {
    event.preventDefault();

    const idTexte = $("produitId").value;
    const nom = $("nom").value.trim();
    const categorie = $("categorie").value.trim();
    const prix = Number($("prix").value);
    const quantite = Number($("quantite").value);
    const ventes = Number($("ventes").value);
    const actif = $("actif").checked;

    if (!nom || !categorie) {
        afficherMessage(
            "Le nom et la catégorie sont obligatoires.", true
        );
        return;
    }

    if (!Number.isFinite(prix) || prix <= 0) {
        afficherMessage(
            "Le prix doit être un nombre strictement positif.", true
        );
        return;
    }

    if (!Number.isInteger(quantite) || quantite < 0) {
        afficherMessage(
            "La quantité doit être un entier positif ou nul.", true
        );
        return;
    }

    if (!Number.isInteger(ventes) || ventes < 0) {
        afficherMessage(
            "Les ventes doivent être un entier positif ou nul.", true
        );
        return;
    }

    const donnees = {
        nom,
        categorie,
        prix,
        quantite,
        ventes,
        actif
    };

    if (idTexte !== "") {
        const id = Number(idTexte);

        if (!produits.some(p => p.id === id)) {
            afficherMessage("Produit introuvable.", true);
            return;
        }

        // Modification sans modifier directement l'objet initial.
        produits = produits.map(p =>
            p.id === id ? { ...p, ...donnees } : p
        );

        afficherMessage("Produit modifié avec succès.");
    } else {
        ajouterProduit(donnees);
        afficherMessage("Produit ajouté avec succès.");
    }

    actualiserCategories();
    actualiserAffichage();

    $("formulairePanel").hidden = false;

    // Fermer le formulaire après affichage du message.
    setTimeout(() => {
        $("formulairePanel").hidden = true;
        $("formProduit").reset();
        $("produitId").value = "";
        $("titreFormulaire").textContent = "Ajouter un produit";
        $("messageFormulaire").textContent = "";
    }, 800);
});

// =====================================
// 12. EVENEMENTS
// =====================================

$("btnAjouter").addEventListener("click", () => {
    $("formProduit").reset();
    $("produitId").value = "";
    $("titreFormulaire").textContent = "Ajouter un produit";
    $("messageFormulaire").textContent = "";
    $("formulairePanel").hidden = false;

    $("formulairePanel").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

$("btnAnnuler").addEventListener("click", () => {
    $("formulairePanel").hidden = true;
    $("formProduit").reset();
    $("produitId").value = "";
    $("messageFormulaire").textContent = "";
});

$("recherche").addEventListener("input", afficherProduits);
$("filtreCategorie").addEventListener("change", afficherProduits);
$("filtreDisponibilite").addEventListener("change", afficherProduits);

$("btnReinitialiser").addEventListener("click", () => {
    $("recherche").value = "";
    $("filtreCategorie").value = "";
    $("filtreDisponibilite").value = "";
    afficherProduits();
});

// =====================================
// 13. ACTUALISATION GENERALE
// =====================================

function actualiserAffichage() {
    afficherProduits();
    calculerStatistiques();
    afficherTopVentes();
    afficherStockParCategorie();
    detecterAnomalies();
}

// Démarrage de l'application.
actualiserCategories();
actualiserAffichage();
