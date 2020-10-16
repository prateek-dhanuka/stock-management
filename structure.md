## Database structure

---

```json
{
  "summary": {
    "count": number, // Total count of all
    "weight": number, // Total weight of all
    "cost": number // Estimated total cost
    //TODO: Determine whether to store complex queries
    // If yes, how?
  },
  "data": {
    "unique_key": {
      "grade": "", // Ex: en8, ms, en19
      "shape": "", // Ex: round, square
      "dia": number, // Diameter
      "loc": "", // Where it is (location)
      "cost": number, // Estimated price
      "count": number, // How many of these there are
      "length": number, // 6000 in case of full
      "origin": "" // Where the steel came from
    }
  },
  "valid": { // Use these to validate data
	  "grades": ["grade1", "grade2", ...],
	  "shapes": ["shape1", "shape2", ...],
	  "locs": ["loc1", "loc2", ...],
	  "origins": ["origin1", "origin2", ...]
	  //TODO: Add a way to add valid options
  }
  //TODO: Should anything else be stored?
}
```
