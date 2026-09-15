// Datos reales de siembra: los mismos que ya vivían en memoria en la vista
// previa de la Fase 1 (4 tableros GENERAL/M&I/ACCU/REFRI con sus tareas
// reales, y el directorio de miembros). Usado por scripts/seed.js (CLI) y
// por el endpoint de siembra de un solo uso GET /api/seed.
"use strict";

function t(o) {
  return Object.assign(
    {
      start: null, end: null, dur: 0, info: "", invitados: [], responsable: "", asistente: "",
      complete: 0, requiereDoc: false, docCompleta: false, isDoc: false, calSynced: false,
      completedAt: null,
    },
    o
  );
}

var BOARDS = [
  { slug: "general", label: "GENERAL", department: "Powertrain", proyectos: [
    { name: "Temes Generals", grupos: [
      { name: "GENERAL", tasks: [
        t({ title: "Conjunto Powertrain validado", start: "2026-07-09", end: "2027-08-02", dur: 151, invitados: ["all"], responsable: "Sergio", calSynced: true })
      ]},
      { name: "M&I", tasks: [
        t({ title: "Placa de Inversor arreglada", start: "2026-07-09", end: "2026-09-15", dur: 8, invitados: ["all"], responsable: "Sergio", calSynced: true }),
        t({ title: "Motores validados con TB", start: "2026-07-09", end: "2026-09-30", dur: 23, responsable: "Sergio", calSynced: true })
      ]},
      { name: "ACCU", tasks: [
        t({ title: "Diseño del TSAC cerrado", start: "2026-07-09", end: "2026-10-31", dur: 54, invitados: ["all"], responsable: "Sergio", calSynced: true }),
        t({ title: "Conjunto Accu validado por convertidores", start: "2026-07-09", end: "2027-01-24", dur: 137, invitados: ["all"], responsable: "Sergio", calSynced: true })
      ]},
      { name: "REFRI", tasks: [] }
    ]}
  ]},

  { slug: "mi", label: "M&I", department: "Powertrain", proyectos: [
    { name: "Electrical", grupos: [
      { name: "Documentación", tasks: [] },
      { name: "Clark-E & Park-E (Motors)", tasks: [
        "Apilar Estátor", "Apilar Stacks", "Impresión 3D Cabezas de Bobina", "Bobinado", "Neutro",
        "Cables de Potencia", "Barnizado", "Fabricación Carcasa", "Ensamblaje Estátor-Carcasa",
        "Fabricación Eje", "Apilar Stacks Rotor en Eje", "Equilibrado Eje", "Fabricación Tapa Delantera",
        "Fabricación Tapa Trasera", "Ensamblaje Final"
      ].reduce(function (acc, base) {
        acc.push(t({ title: base + " Park-E", responsable: "Sergio" }));
        acc.push(t({ title: base + " Clark-E", responsable: "Sergio" }));
        return acc;
      }, []).concat([
        t({ title: "Cableado Resolver Park-E", info: "Sellar resolver", responsable: "Sergio" }),
        t({ title: "Cableado Resolver Clark-E", info: "Sellar resolver", responsable: "Sergio" })
      ]) }
    ]},
    { name: "Inverters", grupos: [
      { name: "New Inverters", tasks: [
        t({ title: "Montaje inverters en HV Box", start: "2026-08-15", end: "2026-08-18", dur: 3, info: "Comprobar montaje HW, poder girar motores desde la caja del inversor", responsable: "Sergio", calSynced: true }),
        t({ title: "Cableado HV Box", start: "2026-07-08", end: "2026-08-12", dur: 34, responsable: "Anna", calSynced: true }),
        t({ title: "Validar Alimentación Inverter", start: "2026-08-19", end: "2026-08-19", dur: 0, responsable: "Sergio", calSynced: true }),
        t({ title: "Validar Cables resolver Inverter", start: "2026-08-19", end: "2026-08-19", dur: 0, responsable: "Sergio", calSynced: true }),
        t({ title: "Cambiar Separadores", start: "2026-08-20", end: "2026-09-01", dur: 11, info: "Falta el de la izquierda", responsable: "Sergio", calSynced: true })
      ]},
      { name: "Control", tasks: [
        t({ title: "Estudio implementación FW", start: "2026-07-21", end: "2026-07-27", dur: 6, responsable: "Anna", calSynced: true }),
        t({ title: "Testplan PI", start: "2026-07-25", end: "2026-07-27", dur: 2, responsable: "Anna", calSynced: true }),
        t({ title: "Testplan MTPA", start: "2026-07-25", end: "2026-07-28", dur: 3, info: "Pasos para la obtención del MTPA y verificación del script anterior", responsable: "Anna", calSynced: true }),
        t({ title: "Parametrización NDrive", start: "2026-08-16", end: "2026-08-18", dur: 2, info: "Pruebas de baja potencia (24V) con motores en vacío", responsable: "Sergio", calSynced: true }),
        t({ title: "Validación valores NDrive con potencia (Batería)", start: "2026-08-16", end: "2026-08-19", dur: 3, info: "Validar parámetros de NDrive con potencia y en vacío (PONER LÍMITES)", responsable: "Sergio", calSynced: true })
      ]}
    ]},
    { name: "Testbench", grupos: [
      { name: "Testbench", tasks: [
        t({ title: "Organización y acabado de cableado", start: "2026-08-16", end: "2026-08-18", dur: 2, info: "Etiquetar cables, conexiones más limpias", responsable: "Victor", calSynced: true }),
        t({ title: "Instalación resistencias terminación CAN (120 Ω)", start: "2026-08-16", end: "2026-08-19", dur: 3, info: "Evitar reflexiones de señal", responsable: "Victor", calSynced: true }),
        t({ title: "Preparar bancada", start: "2026-08-16", end: "2026-08-20", dur: 4, responsable: "Victor", calSynced: true }),
        t({ title: "Esquemático de señales", start: "2026-08-16", end: "2026-08-18", dur: 2, responsable: "Victor", calSynced: true }),
        t({ title: "Test Plan", responsable: "Sergio" }),
        t({ title: "Calibrar y verificar el acoplamiento mecánico motor-freno", start: "2026-08-21", end: "2026-08-21", dur: 0, info: "Seguir el TestPlan", responsable: "Sergio", asistente: "Victor", calSynced: true }),
        t({ title: "Validación curva par-velocidad Park-E", start: "2026-08-21", end: "2026-08-22", dur: 1, info: "Seguir el TestPlan", responsable: "Sergio", asistente: "Victor", calSynced: true }),
        t({ title: "Validación curva par-velocidad Clark-E", start: "2026-08-21", end: "2026-08-22", dur: 1, info: "Seguir el TestPlan", responsable: "Sergio", asistente: "Victor", calSynced: true }),
        t({ title: "Mapeado Iq-Id Park-E", start: "2026-08-22", end: "2026-08-23", dur: 1, info: "Seguir el TestPlan", responsable: "Sergio", asistente: "Victor", calSynced: true }),
        t({ title: "Mapeado Iq-Id Clark-E", start: "2026-08-22", end: "2026-08-23", dur: 1, info: "Seguir el TestPlan", responsable: "Sergio", asistente: "Victor", calSynced: true }),
        t({ title: "Test cooling", start: "2026-08-23", end: "2026-08-24", dur: 1, info: "Seguir el TestPlan", responsable: "Joan O'Callaghan", asistente: "Jose Salazar", calSynced: true })
      ]}
    ]}
  ]},

  { slug: "accu", label: "ACCU", department: "Powertrain", proyectos: [
    { name: "Electrical", grupos: [
      { name: "Documentación", tasks: [
        t({ title: "Presupuesto Accu temporada 26/27", responsable: "Anna", complete: 100 })
      ]},
      { name: "Low Propia", tasks: [
        t({ title: "Soldar pletinas", responsable: "Marco", complete: 100 }),
        t({ title: "Conseguir tornillos de plástico", responsable: "Marco", complete: 100 }),
        t({ title: "Avellanado tapas", responsable: "Marco", complete: 100 }),
        t({ title: "Adaptar pletinas laterales", responsable: "Marco", complete: 100 }),
        t({ title: "BMS", responsable: "Eduard", complete: 80 }),
        t({ title: "Testplan convertidor Circutor", info: "Pasos para usar el accu de forma óptima con el testbench", responsable: "Marco", complete: 100 }),
        t({ title: "Testplan validación Accu", info: "Qué se hará para validar el accu con los convertidores de Circutor", responsable: "Marco", asistente: "Jinpeng", complete: 100 }),
        t({ title: "Ensayo convertidor Circutor con corriente constante", start: "2026-08-24", end: "2026-09-12", dur: 18, responsable: "Marco", complete: 100, calSynced: true }),
        t({ title: "Ensayo convertidor Circutor con perfiles", start: "2026-08-24", end: "2026-09-12", dur: 18, responsable: "Marco", complete: 100, calSynced: true }),
        t({ title: "Ensayo convertidor Circutor con rampas pronunciadas", start: "2026-08-24", end: "2026-09-12", dur: 18, responsable: "Marco", complete: 100, calSynced: true }),
        t({ title: "Ensayo convertidor Circutor con rampas suaves", start: "2026-08-24", end: "2026-09-12", dur: 18, responsable: "Marco", complete: 100, calSynced: true }),
        t({ title: "Ensayo convertidor Circutor con perfil de circuito", start: "2026-08-24", end: "2026-09-12", dur: 18, responsable: "Marco", complete: 35, calSynced: true })
      ]},
      { name: "New Old Accu", tasks: [
        t({ title: "Buscar nuevas NTC's para cumplir rules", start: "2026-08-16", end: "2026-08-22", dur: 6, info: "Hablar con electrónicos sobre viabilidad, leer rules", responsable: "Álvaro", complete: 100, calSynced: true }),
        t({ title: "Definir arquitectura de sensado NTC", start: "2026-08-22", end: "2026-09-15", dur: 23, responsable: "Álvaro", complete: 100, calSynced: true }),
        t({ title: "Definir sistema de fijación de NTC", start: "2026-08-22", end: "2026-09-15", dur: 23, responsable: "Álvaro", complete: 100, calSynced: true }),
        t({ title: "Diseñar acceso individual a NTC/Voltage", start: "2026-08-22", end: "2026-09-15", dur: 23, responsable: "Álvaro", complete: 100, calSynced: true }),
        t({ title: "Revisar integración NTC + TSAC + BMS", info: "Banco de pruebas antes de fabricar", complete: 0 }),
        t({ title: "Diseño conceptual de desfase de stacks", start: "2026-08-22", end: "2026-09-15", dur: 23, responsable: "Álvaro", complete: 100, calSynced: true }),
        t({ title: "Diseño conceptual de conectores", start: "2026-08-22", end: "2026-09-15", dur: 23, info: "Evitar cortocircuitos", responsable: "Álvaro", complete: 100, calSynced: true }),
        t({ title: "Diseño conceptual de la tapa de separación", start: "2026-08-22", end: "2026-09-15", dur: 23, responsable: "Álvaro", complete: 100, calSynced: true }),
        t({ title: "Diseño CAD y fabricación de pieza 3D para misconnections", start: "2026-09-02", end: "2026-09-12", dur: 10, responsable: "Jinpeng", complete: 50, calSynced: true }),
        t({ title: "Definir solución para cable largo del accu (+/-)", start: "2026-09-02", end: "2026-09-12", dur: 10, info: "Opción maintenance custom o busbar", responsable: "Jinpeng", asistente: "Álvaro", complete: 50, calSynced: true })
      ]},
      { name: "Carrito", tasks: [
        t({ title: "Búsqueda de nuevas ruedas", start: "2026-08-22", end: "2026-09-15", dur: 23, responsable: "Álvaro", complete: 100, calSynced: true }),
        t({ title: "Revisar frenos", start: "2026-08-22", end: "2026-09-15", dur: 23, responsable: "Álvaro", complete: 100, calSynced: true }),
        t({ title: "Cambiar tornillos actuador", start: "2026-08-22", end: "2026-09-15", dur: 23, responsable: "Álvaro", complete: 100, calSynced: true })
      ]},
      { name: "Low Comercial", tasks: [] }
    ]}
  ]},

  { slug: "refri", label: "REFRI", department: "Powertrain", proyectos: [
    { name: "Temporada 25/27", grupos: [
      { name: "Motors", tasks: [
        t({ title: "Camisa 25-26", start: "2026-07-01", end: "2026-08-29", dur: 58, info: "Pruebas de montaje; falta testing para acabar", responsable: "Joan O'Callaghan", complete: 80, calSynced: true }),
        t({ title: "Fer cad final", start: "2026-07-01", end: "2026-07-05", dur: 4, responsable: "Joan O'Callaghan", complete: 100, calSynced: true }),
        t({ title: "Proves d'impressió", start: "2026-07-08", end: "2026-07-10", dur: 2, responsable: "Joan O'Callaghan", complete: 100, calSynced: true }),
        t({ title: "Imprimir i instal·lar camises a motors", start: "2026-07-10", end: "2026-09-13", dur: 63, requiereDoc: true, responsable: "Joan O'Callaghan", complete: 95, calSynced: true }),
        t({ title: "Validació testbench", start: "2026-08-03", end: "2026-08-10", dur: 7, responsable: "Lucas Lin", asistente: "Joan O'Callaghan", complete: 0, calSynced: true }),
        t({ title: "Transmi dona punts de subjecció en CAD", start: "2026-09-07", end: "2026-09-14", dur: 7, responsable: "TRANSMI", complete: 0 }),
        t({ title: "Muntatge final funcional camisa 3D", start: "2026-09-07", end: "2026-09-20", dur: 13, info: "Depèn de la impressora del Max", responsable: "Joan O'Callaghan", complete: 0, calSynced: true }),
        t({ title: "Iteració i millora CFD", start: "2026-09-14", end: "2026-10-04", dur: 20, requiereDoc: true, info: "L'inici depèn de la llicència d'star", responsable: "Joan O'Callaghan", complete: 0, calSynced: true }),
        t({ title: "Disseny mecànic", start: "2026-10-05", end: "2026-10-11", dur: 6, requiereDoc: true, responsable: "Joan O'Callaghan", complete: 0, calSynced: true }),
        t({ title: "Enviar a fabricar a IAMG", start: "2026-10-18", end: "2026-10-23", dur: 5, responsable: "Joan O'Callaghan", complete: 0, calSynced: true }),
        t({ title: "Arriben camises IAMG", start: "2026-10-23", end: "2026-11-27", dur: 34, responsable: "IAMG (patró)", asistente: "Joan O'Callaghan", complete: 0 }),
        t({ title: "Testbench a bancada", start: "2026-12-06", end: "2026-12-20", dur: 14, requiereDoc: true, responsable: "Lucas Lin", asistente: "Joan O'Callaghan", complete: 0, calSynced: true })
      ]},
      { name: "Accu", tasks: [
        t({ title: "Muntar o revisar els fans de la low", responsable: "Jose Salazar", complete: 100 }),
        t({ title: "Fer simu tèrmica", start: "2026-07-10", end: "2026-07-17", dur: 7, responsable: "Jose Salazar", complete: 100, calSynced: true }),
        t({ title: "Estudis aïllats de refrigeració de cel·la", start: "2026-07-10", end: "2026-07-17", dur: 7, responsable: "Jose Salazar", complete: 50, calSynced: true }),
        t({ title: "Test de pèrdues d'accu", start: "2026-09-16", end: "2026-09-19", dur: 3, info: "Aprofitar el test per mesurar pèrdues i eficiència de refrigeració", responsable: "Lucas Lin", asistente: "Jose Salazar", complete: 0, calSynced: true }),
        t({ title: "Estudi CFD de prototips de modificacions de ACCU", start: "2026-09-14", end: "2026-10-11", dur: 27, requiereDoc: true, info: "Depèn de la llicència d'star, actualitzar setmanalment", responsable: "Jose Salazar", complete: 0, calSynced: true }),
        t({ title: "Disseny CFD final (TSAC + tovera)", start: "2026-10-11", end: "2026-11-01", dur: 20, requiereDoc: true, responsable: "Jose Salazar", complete: 0, calSynced: true }),
        t({ title: "Disseny mecànic (TSAC + tovera)", start: "2026-11-01", end: "2026-11-08", dur: 7, requiereDoc: true, info: "PARLAR AMB STRUCTURAL PER ACES", responsable: "Jose Salazar", complete: 0, calSynced: true }),
        t({ title: "Fabri accu", start: "2027-01-01", end: "2027-01-10", dur: 9, responsable: "Jose Salazar", complete: 0, calSynced: true })
      ]},
      { name: "Radiador", tasks: [
        t({ title: "Position assessment de diferents posicions del radiador", start: "2026-07-17", end: "2026-07-18", dur: 1, requiereDoc: true, responsable: "Joan O'Callaghan", asistente: "Jose Salazar", complete: 100 }),
        t({ title: "DECISIÓ DE POSICIÓ DE RADIADORS", start: "2026-08-04", end: "2026-08-08", dur: 4, requiereDoc: true, info: "Falta simus aero", responsable: "Joan O'Callaghan", asistente: "Jose Salazar", complete: 100 }),
        t({ title: "Informe del funcionament del radiador en el testbench de motors", start: "2026-09-21", end: "2026-10-04", dur: 13, requiereDoc: true, responsable: "Joan O'Callaghan", asistente: "Lucas Lin", complete: 0, calSynced: true }),
        t({ title: "Instal·lació dels radiadors, sensòrica i millores per el testing", start: "2026-10-04", end: "2026-10-11", dur: 7, responsable: "Lucas Lin", asistente: "Jose Salazar", complete: 0, calSynced: true }),
        t({ title: "Tancar disseny mecànic de radiador", start: "2026-10-18", end: "2026-11-08", dur: 20, requiereDoc: true, info: "Plànols, llista de materials", responsable: "Joan O'Callaghan", asistente: "Lucas Lin", complete: 0, calSynced: true }),
        t({ title: "Fabricació radiadors", start: "2026-11-30", end: "2026-12-20", dur: 20, info: "Haurien d'estar acabats i provats", responsable: "Joan O'Callaghan", asistente: "Lucas Lin", complete: 0, calSynced: true })
      ]},
      { name: "Connectivitat", tasks: [
        t({ title: "Mirar connectors que siguin rule compliant", start: "2026-07-02", end: "2026-07-27", dur: 25, requiereDoc: true, responsable: "Lucas Alfonso", complete: 100 }),
        t({ title: "Buscar tubs per testing", start: "2026-08-01", end: "2026-08-27", dur: 26, responsable: "Lucas Alfonso", complete: 100 }),
        t({ title: "Selecció de bombes", start: "2026-09-21", end: "2026-10-12", dur: 21, requiereDoc: true, info: "Necesita test de camises o testbench de motors", responsable: "Joan O'Callaghan", asistente: "Lucas Alfonso", complete: 20, calSynced: true }),
        t({ title: "Primera iteració de la refri al SW", start: "2026-09-07", end: "2026-09-12", dur: 5, requiereDoc: true, responsable: "Lucas Alfonso", complete: 100 }),
        t({ title: "Determinació de la sensòrica i del posicionament", start: "2026-09-12", end: "2026-09-19", dur: 7, info: "PARLAR AMB CONTROLS I ELECTRONICS", responsable: "Lucas Lin", asistente: "Lucas Alfonso", complete: 0, calSynced: true }),
        t({ title: "Aero tanca mainflap", start: "2026-09-21", end: "2026-09-27", dur: 6, responsable: "AERO", complete: 0 }),
        t({ title: "Structural tanca disseny", start: "2026-10-05", end: "2026-10-11", dur: 6, responsable: "STRUCTURAL", complete: 0 }),
        t({ title: "Fabri fittings i suports (SW) + test de funcionament correcte", start: "2026-12-21", end: "2027-01-03", dur: 12, responsable: "Lucas Alfonso", complete: 0, calSynced: true })
      ]},
      { name: "Data", tasks: [
        t({ title: "Test bench de coldplate", start: "2026-07-01", end: "2026-09-12", dur: 71, requiereDoc: true, info: "Es troba a Data → Testbench (Test 5 - CP26)", responsable: "Lucas Lin", complete: 100 }),
        t({ title: "Preparar material per testbench", start: "2026-07-27", end: "2026-08-02", dur: 5, info: "NO ES POT CONSIDERAR PREPARAT SI FUGEN LES NTC'S — demanat a Max imprimir noves", responsable: "Lucas Lin", complete: 80, calSynced: true }),
        t({ title: "Document de lo après al simulink", start: "2026-07-27", end: "2026-09-12", dur: 45, requiereDoc: true, info: "S'HA PRORROGAT FINS EL 12, PERÒ JA NO ES FARÀ MÉS", responsable: "Lucas Alfonso", complete: 100 }),
        t({ title: "Test bench de motors", start: "2026-09-21", end: "2026-10-04", dur: 13, requiereDoc: true, info: "Necessitem camisa final i motors i inversors funcionant", responsable: "Lucas Lin", asistente: "Jose Salazar", complete: 0, calSynced: true }),
        t({ title: "Test bench de camisa 25-26", start: "2026-09-21", end: "2026-10-04", dur: 13, requiereDoc: true, info: "Necessitem la camisa final sense fuites", responsable: "Lucas Lin", asistente: "Joan O'Callaghan", complete: 0, calSynced: true })
      ]},
      { name: "Misc", tasks: [
        t({ title: "Fer simus de colze CFD", start: "2026-07-14", end: "2026-07-26", dur: 12, responsable: "Lucas Lin", complete: 100 }),
        t({ title: "Fer inventari PWT", start: "2026-07-17", end: "2026-07-21", dur: 4, responsable: "Joan O'Callaghan", complete: 100 }),
        t({ title: "Buscar la manera de ficar reixes per el radiador", start: "2026-08-01", end: "2026-09-12", dur: 41, info: "Falta check", responsable: "Lucas Lin", complete: 100 })
      ]}
    ]}
  ]}
];

var MEMBERS = [
  { name: "Anna", department: "Powertrain" }, { name: "Sergio", department: "Powertrain" }, { name: "Victor", department: "Powertrain" },
  { name: "Marco", department: "Powertrain" }, { name: "Eduard", department: "Powertrain" }, { name: "Álvaro", department: "Powertrain" },
  { name: "Jinpeng", department: "Powertrain" }, { name: "Joan O'Callaghan", department: "Powertrain" }, { name: "Jose Salazar", department: "Powertrain" },
  { name: "Lucas Lin", department: "Powertrain" }, { name: "Lucas Alfonso", department: "Powertrain" }
];

module.exports = { BOARDS: BOARDS, MEMBERS: MEMBERS };
