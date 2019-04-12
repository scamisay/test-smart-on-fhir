function getPatientName (pt) {
  if (pt.name) {
    var names = pt.name.map(function(name) {
      return name.given.join(" ") + " " + name.family.join(" ");
    });
    return names.join(" / ")
  } else {
    return "anonymous";
  }
}

function getMedicationName (medCodings) {
  var coding = medCodings.find(function(c){
    return c.system == "http://www.nlm.nih.gov/research/umls/rxnorm";
  });

  return coding && coding.display || "Unnamed Medication(TM)"
}

function displayPatient (pt) {
  document.getElementById('patient_name').innerHTML = getPatientName(pt);
}

var med_list = document.getElementById('med_list');

function displayMedication (medCodings) {
  med_list.innerHTML += "<li> " + getMedicationName(medCodings) + "</li>";
}

// Create a FHIR client (server URL, patient id in `demo`)
var smart = FHIR.client(demo),
    pt = smart.patient;

// Create a patient banner by fetching + rendering demographics
//smart.patient.read().then(function(pt) {
//  displayPatient (pt);
//});


smart.patient.api.fetchAllWithReferences({type: "MedicationOrder"},["MedicationOrder.medicationReference"]).then(function(results, refs) {
   printJSON(results);
});

function printJSON(data){
  document.getElementById("json").innerHTML = JSON.stringify(data, undefined, 2);
}
