/* ============================================================
   Ripple — Study: Biology
   Diagrams are inline SVG so they scale, theme, and work offline.
   They use currentColor / CSS variables, so they follow your accent.
   ============================================================ */

window.STUDY_BIO = {

  /* ---- labelled diagrams ---- */
  diagrams: {

    animalCell: `<svg viewBox="0 0 560 400" class="bio-svg" role="img" aria-label="Animal cell">
      <ellipse cx="270" cy="200" rx="185" ry="145" class="d-fill-1 d-stroke"/>
      <ellipse cx="270" cy="200" rx="176" ry="137" class="d-fill-2" stroke="none"/>
      <circle cx="250" cy="185" r="52" class="d-fill-3 d-stroke"/>
      <circle cx="250" cy="185" r="18" class="d-fill-4" stroke="none"/>
      <ellipse cx="150" cy="255" rx="34" ry="16" class="d-fill-5 d-stroke" transform="rotate(-20 150 255)"/>
      <path d="M136 255 q8-7 14 0 t14 0 t14 0" class="d-stroke-thin" fill="none"/>
      <ellipse cx="365" cy="270" rx="30" ry="14" class="d-fill-5 d-stroke" transform="rotate(15 365 270)"/>
      <path d="M170 130 q30-14 60 0 M170 145 q30-14 60 0 M170 160 q30-14 60 0" class="d-stroke-thin" fill="none"/>
      <path d="M330 120 q28-10 54 0 M334 133 q26-10 50 0 M338 146 q24-10 46 0" class="d-stroke-thin" fill="none"/>
      <circle cx="200" cy="290" r="13" class="d-fill-6 d-stroke"/>
      <circle cx="310" cy="105" r="4" class="d-fill-4" stroke="none"/>
      <circle cx="298" cy="118" r="4" class="d-fill-4" stroke="none"/>
      <circle cx="322" cy="122" r="4" class="d-fill-4" stroke="none"/>
      <g class="d-label">
        <line x1="250" y1="185" x2="120" y2="60" class="d-lead"/><text x="112" y="54" text-anchor="end">Nucleus</text>
        <line x1="250" y1="185" x2="300" y2="45" class="d-lead"/><text x="304" y="40">Nucleolus</text>
        <line x1="150" y1="255" x2="60" y2="330" class="d-lead"/><text x="56" y="342" text-anchor="end">Mitochondrion</text>
        <line x1="200" y1="130" x2="90" y2="120" class="d-lead"/><text x="84" y="115" text-anchor="end">Rough ER</text>
        <line x1="356" y1="130" x2="460" y2="80" class="d-lead"/><text x="466" y="76">Golgi apparatus</text>
        <line x1="200" y1="290" x2="150" y2="370" class="d-lead"/><text x="146" y="382" text-anchor="end">Lysosome</text>
        <line x1="310" y1="112" x2="420" y2="150" class="d-lead"/><text x="426" y="152">Ribosomes</text>
        <line x1="450" y1="240" x2="510" y2="285" class="d-lead"/><text x="514" y="290">Cell membrane</text>
        <line x1="380" y1="200" x2="500" y2="200" class="d-lead"/><text x="506" y="204">Cytoplasm</text>
      </g>
    </svg>`,

    plantCell: `<svg viewBox="0 0 560 400" class="bio-svg" role="img" aria-label="Plant cell">
      <rect x="90" y="50" width="380" height="300" rx="18" class="d-fill-1 d-stroke"/>
      <rect x="102" y="62" width="356" height="276" rx="12" class="d-fill-2 d-stroke-thin"/>
      <rect x="140" y="95" width="280" height="210" rx="14" class="d-fill-3" stroke="none" opacity=".5"/>
      <circle cx="160" cy="130" r="34" class="d-fill-4 d-stroke"/>
      <circle cx="160" cy="130" r="12" class="d-fill-6" stroke="none"/>
      <ellipse cx="380" cy="120" rx="26" ry="13" class="d-fill-5 d-stroke" transform="rotate(-25 380 120)"/>
      <ellipse cx="180" cy="300" rx="24" ry="12" class="d-fill-5 d-stroke" transform="rotate(10 180 300)"/>
      <ellipse cx="390" cy="290" rx="22" ry="11" class="d-fill-5 d-stroke" transform="rotate(-15 390 290)"/>
      <ellipse cx="300" cy="90" rx="20" ry="10" class="d-fill-6 d-stroke"/>
      <g class="d-label">
        <line x1="95" y1="60" x2="40" y2="30" class="d-lead"/><text x="36" y="26" text-anchor="end">Cell wall</text>
        <line x1="108" y1="80" x2="40" y2="105" class="d-lead"/><text x="36" y="110" text-anchor="end">Cell membrane</text>
        <line x1="160" y1="130" x2="45" y2="185" class="d-lead"/><text x="41" y="190" text-anchor="end">Nucleus</text>
        <line x1="280" y1="200" x2="300" y2="378" class="d-lead"/><text x="300" y="392" text-anchor="middle">Large central vacuole</text>
        <line x1="380" y1="120" x2="500" y2="70" class="d-lead"/><text x="506" y="66">Mitochondrion</text>
        <line x1="300" y1="90" x2="380" y2="30" class="d-lead"/><text x="386" y="26">Chloroplast</text>
        <line x1="390" y1="290" x2="510" y2="320" class="d-lead"/><text x="514" y="325">Cytoplasm</text>
      </g>
    </svg>`,

    neuron: `<svg viewBox="0 0 620 300" class="bio-svg" role="img" aria-label="Neuron">
      <circle cx="120" cy="150" r="42" class="d-fill-3 d-stroke"/>
      <circle cx="120" cy="150" r="16" class="d-fill-4" stroke="none"/>
      <path d="M92 118 L45 75 M78 140 L20 132 M88 182 L38 218 M120 108 L108 48 M152 120 L200 70" class="d-stroke" fill="none"/>
      <path d="M45 75 l-14-10 M45 75 l-4-16 M20 132 l-16-6 M20 132 l-14 8 M38 218 l-12 12 M38 218 l-16 2" class="d-stroke-thin" fill="none"/>
      <line x1="162" y1="150" x2="470" y2="150" class="d-stroke" stroke-width="5" fill="none"/>
      <g class="d-fill-5 d-stroke">
        <rect x="180" y="136" width="58" height="28" rx="13"/>
        <rect x="252" y="136" width="58" height="28" rx="13"/>
        <rect x="324" y="136" width="58" height="28" rx="13"/>
        <rect x="396" y="136" width="58" height="28" rx="13"/>
      </g>
      <path d="M470 150 l38-26 M470 150 l40 0 M470 150 l38 26" class="d-stroke" fill="none"/>
      <circle cx="512" cy="122" r="7" class="d-fill-6 d-stroke"/>
      <circle cx="514" cy="150" r="7" class="d-fill-6 d-stroke"/>
      <circle cx="512" cy="178" r="7" class="d-fill-6 d-stroke"/>
      <g class="d-label">
        <line x1="120" y1="150" x2="120" y2="252" class="d-lead"/><text x="120" y="268" text-anchor="middle">Cell body (cyton)</text>
        <line x1="40" y1="100" x2="20" y2="40" class="d-lead"/><text x="16" y="34">Dendrites</text>
        <line x1="330" y1="150" x2="330" y2="252" class="d-lead"/><text x="330" y="268" text-anchor="middle">Axon</text>
        <line x1="209" y1="136" x2="200" y2="60" class="d-lead"/><text x="196" y="52">Myelin sheath</text>
        <line x1="245" y1="150" x2="300" y2="60" class="d-lead"/><text x="304" y="52">Node of Ranvier</text>
        <line x1="514" y1="150" x2="560" y2="235" class="d-lead"/><text x="564" y="245" text-anchor="end">Axon terminals</text>
        <line x1="120" y1="134" x2="60" y2="270" class="d-lead"/><text x="56" y="284" text-anchor="end">Nucleus</text>
      </g>
    </svg>`,

    heart: `<svg viewBox="0 0 480 420" class="bio-svg" role="img" aria-label="Human heart">
      <path d="M150 90 q-60 0 -60 90 q0 120 90 190 q90-70 90-190 q0-90 -60-90 q-30 0 -30 40 q0-40 -30-40 z"
            transform="translate(60,20) scale(1.05)" class="d-fill-1 d-stroke"/>
      <line x1="248" y1="110" x2="248" y2="330" class="d-stroke" fill="none"/>
      <line x1="150" y1="200" x2="248" y2="200" class="d-stroke-thin" fill="none"/>
      <line x1="248" y1="200" x2="350" y2="200" class="d-stroke-thin" fill="none"/>
      <text x="196" y="170" class="d-in" text-anchor="middle">RA</text>
      <text x="196" y="265" class="d-in" text-anchor="middle">RV</text>
      <text x="300" y="170" class="d-in" text-anchor="middle">LA</text>
      <text x="300" y="265" class="d-in" text-anchor="middle">LV</text>
      <path d="M210 108 q-6 -60 -46 -72" class="d-stroke" stroke-width="9" fill="none" opacity=".55"/>
      <path d="M262 104 q10 -60 62 -66" class="d-stroke" stroke-width="9" fill="none" opacity=".55"/>
      <path d="M150 150 q-52 -6 -70 -40" class="d-stroke" stroke-width="7" fill="none" opacity=".45"/>
      <path d="M348 150 q54 -6 74 -34" class="d-stroke" stroke-width="7" fill="none" opacity=".45"/>
      <g class="d-label">
        <line x1="164" y1="40" x2="120" y2="24" class="d-lead"/><text x="114" y="20" text-anchor="end">Pulmonary artery</text>
        <line x1="324" y1="38" x2="380" y2="22" class="d-lead"/><text x="386" y="18">Aorta</text>
        <line x1="82" y1="112" x2="30" y2="130" class="d-lead"/><text x="26" y="126" text-anchor="end">Vena cava</text>
        <line x1="420" y1="118" x2="466" y2="132" class="d-lead"/><text x="470" y="128" text-anchor="end">Pulmonary vein</text>
        <line x1="196" y1="200" x2="60" y2="240" class="d-lead"/><text x="56" y="244" text-anchor="end">Tricuspid valve</text>
        <line x1="300" y1="200" x2="430" y2="240" class="d-lead"/><text x="434" y="244" text-anchor="end">Bicuspid valve</text>
        <line x1="248" y1="300" x2="248" y2="392" class="d-lead"/><text x="248" y="406" text-anchor="middle">Septum</text>
      </g>
    </svg>`,

    nephron: `<svg viewBox="0 0 520 420" class="bio-svg" role="img" aria-label="Nephron">
      <circle cx="120" cy="80" r="42" class="d-fill-1 d-stroke"/>
      <path d="M100 66 q16-12 30 2 t-4 22 q-18 10 -28-6 q-8-14 2-18 z" class="d-fill-6 d-stroke-thin"/>
      <path d="M80 62 q-40-14 -60 4" class="d-stroke" stroke-width="5" fill="none"/>
      <path d="M84 104 q-40 14 -58 34" class="d-stroke" stroke-width="4" fill="none"/>
      <path d="M162 88 q40 6 44 34 q4 26 -34 30 q-40 4 -32 34 q8 28 40 20"
            class="d-stroke" stroke-width="5" fill="none"/>
      <path d="M180 206 q-10 40 -14 90 q-2 40 34 40 q36 0 40-40 q4-46 -8-88"
            class="d-stroke" stroke-width="5" fill="none"/>
      <path d="M232 208 q30-6 44 16 q14 24 -12 34 q-30 12 -18 36 q10 22 42 14"
            class="d-stroke" stroke-width="5" fill="none"/>
      <path d="M288 308 q54 4 54 46 q0 40 0 56" class="d-stroke" stroke-width="7" fill="none"/>
      <g class="d-label">
        <line x1="120" y1="80" x2="120" y2="14" class="d-lead"/><text x="120" y="10" text-anchor="middle">Bowman’s capsule</text>
        <line x1="118" y1="80" x2="230" y2="46" class="d-lead"/><text x="236" y="42">Glomerulus</text>
        <line x1="20" y1="66" x2="10" y2="34" class="d-lead"/><text x="6" y="30" text-anchor="start">Afferent arteriole</text>
        <line x1="26" y1="138" x2="8" y2="170" class="d-lead"/><text x="4" y="182">Efferent arteriole</text>
        <line x1="200" y1="130" x2="330" y2="120" class="d-lead"/><text x="336" y="124">Proximal tubule (PCT)</text>
        <line x1="200" y1="300" x2="80" y2="330" class="d-lead"/><text x="76" y="334" text-anchor="end">Loop of Henle</text>
        <line x1="262" y1="240" x2="400" y2="216" class="d-lead"/><text x="406" y="220">Distal tubule (DCT)</text>
        <line x1="342" y1="380" x2="440" y2="392" class="d-lead"/><text x="446" y="396" text-anchor="end">Collecting duct</text>
      </g>
    </svg>`,

    flower: `<svg viewBox="0 0 520 400" class="bio-svg" role="img" aria-label="Flower structure">
      <line x1="260" y1="290" x2="260" y2="390" class="d-stroke" stroke-width="7"/>
      <path d="M180 288 q-70 -10 -96 -44 M340 288 q70 -10 96 -44" class="d-fill-5 d-stroke" fill="none" stroke-width="6"/>
      <path d="M200 286 q-90 -34 -128 -110 q70 -6 128 60 z" class="d-fill-2 d-stroke"/>
      <path d="M320 286 q90 -34 128 -110 q-70 -6 -128 60 z" class="d-fill-2 d-stroke"/>
      <path d="M215 284 q-40 -110 45 -170 q85 60 45 170 z" class="d-fill-3 d-stroke" opacity=".55"/>
      <ellipse cx="260" cy="278" rx="42" ry="26" class="d-fill-1 d-stroke"/>
      <circle cx="248" cy="278" r="6" class="d-fill-6" stroke="none"/>
      <circle cx="266" cy="284" r="6" class="d-fill-6" stroke="none"/>
      <line x1="260" y1="256" x2="260" y2="150" class="d-stroke" stroke-width="4"/>
      <circle cx="260" cy="142" r="14" class="d-fill-4 d-stroke"/>
      <g class="d-stroke" stroke-width="3" fill="none">
        <line x1="212" y1="262" x2="180" y2="162"/><line x1="308" y1="262" x2="340" y2="162"/>
        <line x1="230" y1="266" x2="212" y2="150"/><line x1="290" y1="266" x2="308" y2="150"/>
      </g>
      <ellipse cx="180" cy="152" rx="13" ry="9" class="d-fill-5 d-stroke"/>
      <ellipse cx="340" cy="152" rx="13" ry="9" class="d-fill-5 d-stroke"/>
      <ellipse cx="212" cy="140" rx="13" ry="9" class="d-fill-5 d-stroke"/>
      <ellipse cx="308" cy="140" rx="13" ry="9" class="d-fill-5 d-stroke"/>
      <g class="d-label">
        <line x1="260" y1="142" x2="260" y2="40" class="d-lead"/><text x="260" y="30" text-anchor="middle">Stigma</text>
        <line x1="260" y1="200" x2="380" y2="60" class="d-lead"/><text x="386" y="54">Style</text>
        <line x1="260" y1="278" x2="410" y2="300" class="d-lead"/><text x="416" y="304" text-anchor="end">Ovary</text>
        <line x1="252" y1="278" x2="400" y2="350" class="d-lead"/><text x="406" y="356" text-anchor="end">Ovule</text>
        <line x1="180" y1="152" x2="60" y2="70" class="d-lead"/><text x="54" y="64" text-anchor="end">Anther</text>
        <line x1="200" y1="200" x2="70" y2="180" class="d-lead"/><text x="64" y="176" text-anchor="end">Filament</text>
        <line x1="140" y1="230" x2="30" y2="250" class="d-lead"/><text x="26" y="254" text-anchor="end">Petal</text>
        <line x1="120" y1="270" x2="40" y2="330" class="d-lead"/><text x="36" y="340" text-anchor="end">Sepal</text>
      </g>
    </svg>`
  },

  /* ---- chapters ---- */
  chapters: [
    {
      id:'cell', ch:'The cell — the unit of life', cls:[8,9,11], diagram:'animalCell',
      intro:'Every living thing is built from cells. Robert Hooke saw the first one in 1665 in a slice of cork; what he actually saw were the empty walls of dead cells. The cell theory that grew out of this says three things: all organisms are made of cells, the cell is the basic unit of life, and every cell comes from a pre-existing cell.',
      notes:[
        { h:'Prokaryotic vs eukaryotic', p:'Prokaryotes (bacteria, blue-green algae) have no true nucleus — their DNA sits naked in the cytoplasm as a nucleoid — and no membrane-bound organelles. Eukaryotes (plants, animals, fungi, protists) have a proper nucleus wrapped in a double membrane, and compartments that divide the labour.' },
        { h:'The plasma membrane', p:'Made of a phospholipid bilayer with proteins floating in it — the fluid mosaic model. It is selectively permeable: it decides what enters and leaves. Water moves across it by osmosis; small molecules by diffusion, which needs no energy; other substances by active transport, which does.' },
        { h:'Nucleus', p:'The control centre. Bounded by a double nuclear membrane with pores, it holds chromatin — DNA plus protein — which condenses into chromosomes during division. The nucleolus inside it makes ribosomes.' },
        { h:'Mitochondria', p:'The powerhouse. A double membrane, the inner one folded into cristae to multiply surface area, where respiration releases energy as ATP. They have their own DNA and ribosomes, so they can make some of their own proteins — evidence they were once free-living bacteria.' },
        { h:'Endoplasmic reticulum and Golgi', p:'Rough ER carries ribosomes and makes proteins; smooth ER makes lipids and detoxifies. The Golgi apparatus is the dispatch department: it modifies, packages and labels what the ER makes.' },
        { h:'Lysosomes', p:'Bags of digestive enzymes that break down worn-out organelles and invading material. If a cell is damaged, they can burst and digest the cell itself — which is why they are called suicide bags.' }
      ],
      terms:[
        ['Cytoplasm','Everything between the membrane and the nucleus, where most reactions happen'],
        ['Organelle','A compartment inside the cell with a specific job'],
        ['Chromatin','DNA + protein, the uncondensed form of chromosomes'],
        ['Cristae','Folds of the inner mitochondrial membrane'],
        ['Osmosis','Diffusion of water across a semi-permeable membrane, from dilute to concentrated'],
        ['Plasmolysis','Shrinking of the protoplasm away from the cell wall in a hypertonic solution']
      ],
      revision:[
        'Cell theory: all living things are made of cells · the cell is the basic unit of life · every cell comes from a pre-existing cell.',
        'Prokaryote = no true nucleus, no membrane-bound organelles. Eukaryote = both present.',
        'Mitochondria and chloroplasts both have their OWN DNA and ribosomes. That is the standard two-mark question.',
        'Lysosome = suicide bag. Golgi = packaging and dispatch. Ribosome = protein factory (and has NO membrane).',
        'Hypotonic → cell swells (endosmosis). Hypertonic → cell shrinks (exosmosis, plasmolysis). Isotonic → no change.'
      ]
    },
    {
      id:'plantcell', ch:'Plant cell — what makes it different', cls:[8,9,11], diagram:'plantCell',
      intro:'A plant cell has everything an animal cell has, plus three things an animal cell never has: a cell wall, a large central vacuole, and plastids. Those three differences explain almost every exam question comparing the two.',
      notes:[
        { h:'Cell wall', p:'Made mainly of cellulose, outside the plasma membrane. It is rigid and fully permeable — it gives shape, mechanical strength, and lets the cell survive being placed in pure water, where an animal cell would burst.' },
        { h:'The large central vacuole', p:'Can occupy up to 90% of the cell. Filled with cell sap — water, salts, sugars, pigments and wastes. Its turgor pressure pushes against the wall and keeps the plant upright; when it is lost, the plant wilts.' },
        { h:'Plastids', p:'Chloroplasts contain chlorophyll and carry out photosynthesis. Chromoplasts hold other pigments and colour flowers and fruit. Leucoplasts are colourless and store starch, oil or protein.' }
      ],
      terms:[
        ['Cellulose','The polysaccharide the plant cell wall is made of'],
        ['Turgidity','The firmness a cell has when its vacuole is full of water'],
        ['Plasmodesmata','Fine channels through cell walls that connect neighbouring cells'],
        ['Grana','Stacks of thylakoids inside a chloroplast, where light is captured']
      ],
      revision:[
        'Plant cell only: cell wall, large central vacuole, plastids. Animal cell only: centrioles, and usually lysosomes in number.',
        'The cell wall is fully permeable; the plasma membrane is SELECTIVELY permeable. Do not confuse them.',
        'Turgor pressure keeps a plant standing. Lose it and the plant wilts.',
        'Chloroplast → green, photosynthesis. Chromoplast → colour. Leucoplast → storage.'
      ]
    },
    {
      id:'neuron', ch:'Control and coordination — the neuron', cls:[10,11], diagram:'neuron',
      intro:'The neuron is the longest cell in your body and the unit of the nervous system. Its whole design is about carrying an electrical message in one direction, fast, and then handing it to the next cell chemically.',
      notes:[
        { h:'The path of an impulse', p:'Dendrites pick up the signal → the cell body processes it → the axon carries it away → axon terminals release neurotransmitters into the synapse → these cross the gap and start a new impulse in the next neuron. The one-way flow at the synapse is why nerve impulses cannot travel backwards.' },
        { h:'Myelin sheath', p:'A fatty insulating layer, broken at intervals by the nodes of Ranvier. The impulse jumps node to node — saltatory conduction — which makes it far faster than in an unmyelinated fibre.' },
        { h:'Reflex arc', p:'Receptor → sensory neuron → relay neuron in the spinal cord → motor neuron → effector (muscle). The signal never waits for the brain, which is exactly why reflexes are quick. The brain is informed afterwards.' },
        { h:'Types', p:'Sensory neurons carry information towards the CNS. Motor neurons carry instructions away from it. Relay (association) neurons sit between them inside the CNS.' }
      ],
      terms:[
        ['Synapse','The tiny gap between two neurons, crossed by chemicals'],
        ['Neurotransmitter','The chemical that carries a signal across a synapse'],
        ['Saltatory conduction','Impulse jumping between nodes of Ranvier'],
        ['Effector','The muscle or gland that carries out the response'],
        ['CNS','Central nervous system — brain and spinal cord']
      ],
      revision:[
        'Impulse direction: dendrite → cell body → axon → synapse. Always one way.',
        'Reflex actions are processed by the SPINAL CORD, not the brain. That is the whole point of a reflex arc.',
        'Electrical along the neuron, CHEMICAL across the synapse.',
        'Myelin speeds conduction by allowing the impulse to jump between nodes of Ranvier.',
        'Cerebrum = thinking, memory. Cerebellum = balance, posture. Medulla = involuntary things like heartbeat and breathing.'
      ]
    },
    {
      id:'heart', ch:'Transportation — the human heart', cls:[10,11], diagram:'heart',
      intro:'The human heart is a four-chambered double pump. The right side handles deoxygenated blood, the left side oxygenated, and the septum between them makes sure the two never mix. That separation is what allows warm-blooded animals to sustain a high metabolic rate.',
      notes:[
        { h:'Double circulation', p:'Blood passes through the heart TWICE in one complete circuit. Pulmonary circulation: right ventricle → lungs → left atrium. Systemic circulation: left ventricle → body → right atrium. This keeps the two bloods separate and maintains high pressure to the body.' },
        { h:'The path of blood', p:'Vena cava → right atrium → tricuspid valve → right ventricle → pulmonary artery → lungs → pulmonary vein → left atrium → bicuspid (mitral) valve → left ventricle → aorta → body.' },
        { h:'Valves', p:'They make the flow one-way. Tricuspid on the right, bicuspid on the left, plus semilunar valves at the exits of the ventricles. The "lub-dub" you hear is the valves closing.' },
        { h:'Why the left ventricle is thickest', p:'It must push blood around the whole body, so it needs the most muscle. The right ventricle only sends blood to the nearby lungs, at lower pressure.' },
        { h:'The exceptions worth remembering', p:'The pulmonary ARTERY carries deoxygenated blood, and the pulmonary VEIN carries oxygenated blood — the opposite of every other artery and vein. Arteries are defined by carrying blood AWAY from the heart, not by what is in them.' }
      ],
      terms:[
        ['Atrium','Upper receiving chamber'],
        ['Ventricle','Lower pumping chamber, thicker walled'],
        ['Septum','The wall separating left and right'],
        ['Systole / diastole','Contraction / relaxation of the heart muscle'],
        ['Lymph','Colourless fluid that returns leaked tissue fluid to the blood']
      ],
      revision:[
        'Left side = oxygenated, right side = deoxygenated. Never the other way round.',
        'Pulmonary artery carries DEoxygenated blood; pulmonary vein carries OXYgenated. The classic trick question.',
        'Left ventricle has the thickest wall because it pumps to the entire body.',
        'Valves prevent backflow. Tricuspid (right), bicuspid/mitral (left).',
        'Arteries: thick walls, no valves, blood away from the heart, under pressure. Veins: thin walls, valves present, blood towards the heart.'
      ]
    },
    {
      id:'nephron', ch:'Excretion — the nephron', cls:[10,11], diagram:'nephron',
      intro:'Each kidney holds about a million nephrons. A nephron does not decide what to throw away — it throws almost everything away first, then carefully takes back what the body still wants. That inversion is the whole idea.',
      notes:[
        { h:'Ultrafiltration', p:'Blood arrives through the afferent arteriole, which is WIDER than the efferent arteriole leaving. That mismatch builds high pressure in the glomerulus and forces water, glucose, salts, amino acids and urea out into Bowman\u2019s capsule. Blood cells and large proteins are too big to pass and stay behind.' },
        { h:'Selective reabsorption', p:'As the filtrate travels along the proximal tubule, loop of Henle and distal tubule, useful things are taken back into the blood: all the glucose, most water, amino acids and salts. Glucose in urine means this step has been overwhelmed — a sign of diabetes.' },
        { h:'The loop of Henle', p:'Concentrates the urine by pulling water back. The longer the loop, the more concentrated the urine an animal can make — which is why desert mammals have very long loops.' },
        { h:'Collecting duct and ADH', p:'The final water adjustment happens here, controlled by antidiuretic hormone. Dehydrated → more ADH → more water reabsorbed → small amounts of dark urine. Well hydrated → less ADH → dilute, pale urine.' }
      ],
      terms:[
        ['Glomerulus','The knot of capillaries inside Bowman’s capsule'],
        ['Ultrafiltration','Filtration under pressure that holds back cells and proteins'],
        ['Filtrate','The liquid forced out of the blood into the capsule'],
        ['ADH','Antidiuretic hormone — controls water reabsorption'],
        ['Dialysis','An artificial kidney, used when the real ones fail']
      ],
      revision:[
        'Three steps in order: ultrafiltration → selective reabsorption → tubular secretion.',
        'The afferent arteriole is WIDER than the efferent one. That is what creates the filtration pressure.',
        'Blood cells and proteins are NOT filtered — they are too large. If they appear in urine, something is wrong.',
        'All glucose is normally reabsorbed. Glucose in urine points to diabetes.',
        'More ADH → more water reabsorbed → less, darker urine.'
      ]
    },
    {
      id:'flower', ch:'Reproduction — the flower', cls:[10,11,12], diagram:'flower',
      intro:'A flower is the reproductive organ of a plant, and every part of it is either protective, attractive, male, or female. Sort each part into one of those four boxes and the chapter becomes simple.',
      notes:[
        { h:'The four whorls', p:'Calyx (sepals) protects the bud. Corolla (petals) attracts pollinators. Androecium (stamens) is male — each stamen is an anther on a filament, and the anther makes pollen. Gynoecium (carpel/pistil) is female — stigma, style and ovary, with ovules inside the ovary.' },
        { h:'Pollination', p:'The transfer of pollen from anther to stigma. Self-pollination is within the same flower or plant; cross-pollination is between different plants of the same species, and gives more variation. Agents include wind, water, insects and birds.' },
        { h:'Fertilisation', p:'Pollen germinates on the stigma and grows a pollen tube down the style to the ovule. The male gamete fuses with the egg to form a zygote. After fertilisation, the ovule becomes the seed and the ovary becomes the fruit.' },
        { h:'Types of flowers', p:'A bisexual flower has both androecium and gynoecium (hibiscus, mustard). A unisexual flower has only one (papaya, watermelon).' }
      ],
      terms:[
        ['Androecium','The male whorl — all the stamens together'],
        ['Gynoecium','The female whorl — carpel or pistil'],
        ['Pollination','Transfer of pollen from anther to stigma'],
        ['Fertilisation','Fusion of male and female gametes'],
        ['Zygote','The single cell formed when gametes fuse']
      ],
      revision:[
        'Sepal protects · Petal attracts · Stamen is male · Carpel is female. Four whorls, four jobs.',
        'Stamen = anther + filament. Carpel = stigma + style + ovary.',
        'After fertilisation: ovule → seed, ovary → fruit, zygote → embryo.',
        'Pollination is only TRANSFER. Fertilisation is FUSION. They are not the same step and the exam checks this.',
        'Cross-pollination gives greater variation than self-pollination.'
      ]
    }
  ]
};
