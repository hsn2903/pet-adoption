const express = require("express");
const debug = require("debug")("app:routes:api:pet");
const debugError = require("debug")("app:error");
const { nanoid } = require("nanoid");

const petsArray = [
  { _id: "1", name: "Fido", createdDate: new Date() },
  { _id: "2", name: "Watson", createdDate: new Date() },
  { _id: "3", name: "Loki", createdDate: new Date() },
];

// create a router
const router = express.Router();

// define routes
router.get("/list", (req, res, next) => {
  res.status(200).json(petsArray);
});

router.get("/:petId", (req, res, next) => {
  const petId = req.params.petId;

  // 1) array lookup
  //   const pet = petsArray[petId];
  //   res.status(200).json(pet);

  // 2) linear search
  //   let pet = null;
  //   for (const p of petsArray) {
  //     if (p.name == petId) {
  //       pet = p;
  //       break;
  //     }
  //   }
  //   res.json(pet);

  // using find
  const pet = petsArray.find((p) => p._id === petId);
  if (!pet) {
    res.status(404).json({ error: "Pet not found" });
  } else {
    res.json(pet);
  }
});

router.put("/new", (req, res, next) => {
  const petId = nanoid();
  const { species, name, gender } = req.body;
  const age = parseInt(req.body.age);
  const pet = {
    _id: petId,
    species,
    name,
    age,
    gender,
    createdDate: new Date(),
  };

  if (!species) {
    res.status(400).json({ error: "species is required" });
  } else if (!name) {
    res.status(400).json({ error: "name is required" });
  } else if (!age) {
    res.status(400).json({ error: "age is required" });
  } else if (!gender) {
    res.status(400).json({ error: "gender is required" });
  } else {
    petsArray.push(pet);
    res.json(pet);
  }
});

router.put("/:petId", (req, res, next) => {
  const petId = req.params.petId;
  //pet için son durum
  const { species, name, age, gender } = req.body;

  // pet için eski durum
  const pet = petsArray.find((p) => p._id === petId);
  // bu id ye ait pet var mı?
  if (!pet) {
    res.status(404).json({ error: "Pet not found" });
  } else {
    if (name != undefined) {
      pet.name = name;
    }
    if (species != undefined) {
      pet.species = species;
    }
    if (age != undefined) {
      pet.age = parseInt(age);
    }
    if (gender != gender) {
      pet.gender = gender;
    }
    pet.lastUpdated = new Date();

    res.json(pet);
  }
});

router.delete("/:petId", (req, res, next) => {
  const petId = req.params.petId;

  // pet'in indexini bul
  const index = petsArray.findIndex((p) => p._id == petId);
  // index 0'dan küçükse pet yok
  if (index < 0) {
    res.status(404).json({ error: "Pet not found!" });
  } else {
    // pet i dziden çıkarıyoruz
    petsArray.splice(index, 1);
    res.json({
      message: "Pet deleted!",
    });
  }
});

// export router
module.exports = router;
