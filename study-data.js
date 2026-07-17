/* ============================================================
   Ripple — Study reference data
   Loaded only by study.html. Edit freely: it's plain data.

   Formula markup: ^ = superscript, _ = subscript.
     "a^2 + b^2 = c^2"      -> a² + b² = c²
     "H_2O"                 -> H₂O
     "v^{-1}" / "x_{max}"   -> braces for multi-character
   ============================================================ */

window.STUDY = {

  /* ---- periodic table: [Z, symbol, name, atomic mass, category] ----
     Masses are standard atomic weights; [brackets] = mass number of the
     most stable known isotope (for elements with no stable form). */
  elements: [
    [1,'H','Hydrogen','1.008','nonmetal'],[2,'He','Helium','4.003','noble'],
    [3,'Li','Lithium','6.94','alkali'],[4,'Be','Beryllium','9.012','alkaline'],
    [5,'B','Boron','10.81','metalloid'],[6,'C','Carbon','12.011','nonmetal'],
    [7,'N','Nitrogen','14.007','nonmetal'],[8,'O','Oxygen','15.999','nonmetal'],
    [9,'F','Fluorine','18.998','halogen'],[10,'Ne','Neon','20.180','noble'],
    [11,'Na','Sodium','22.990','alkali'],[12,'Mg','Magnesium','24.305','alkaline'],
    [13,'Al','Aluminium','26.982','post'],[14,'Si','Silicon','28.085','metalloid'],
    [15,'P','Phosphorus','30.974','nonmetal'],[16,'S','Sulfur','32.06','nonmetal'],
    [17,'Cl','Chlorine','35.45','halogen'],[18,'Ar','Argon','39.95','noble'],
    [19,'K','Potassium','39.098','alkali'],[20,'Ca','Calcium','40.078','alkaline'],
    [21,'Sc','Scandium','44.956','transition'],[22,'Ti','Titanium','47.867','transition'],
    [23,'V','Vanadium','50.942','transition'],[24,'Cr','Chromium','51.996','transition'],
    [25,'Mn','Manganese','54.938','transition'],[26,'Fe','Iron','55.845','transition'],
    [27,'Co','Cobalt','58.933','transition'],[28,'Ni','Nickel','58.693','transition'],
    [29,'Cu','Copper','63.546','transition'],[30,'Zn','Zinc','65.38','transition'],
    [31,'Ga','Gallium','69.723','post'],[32,'Ge','Germanium','72.630','metalloid'],
    [33,'As','Arsenic','74.922','metalloid'],[34,'Se','Selenium','78.971','nonmetal'],
    [35,'Br','Bromine','79.904','halogen'],[36,'Kr','Krypton','83.798','noble'],
    [37,'Rb','Rubidium','85.468','alkali'],[38,'Sr','Strontium','87.62','alkaline'],
    [39,'Y','Yttrium','88.906','transition'],[40,'Zr','Zirconium','91.224','transition'],
    [41,'Nb','Niobium','92.906','transition'],[42,'Mo','Molybdenum','95.95','transition'],
    [43,'Tc','Technetium','[98]','transition'],[44,'Ru','Ruthenium','101.07','transition'],
    [45,'Rh','Rhodium','102.91','transition'],[46,'Pd','Palladium','106.42','transition'],
    [47,'Ag','Silver','107.87','transition'],[48,'Cd','Cadmium','112.41','transition'],
    [49,'In','Indium','114.82','post'],[50,'Sn','Tin','118.71','post'],
    [51,'Sb','Antimony','121.76','metalloid'],[52,'Te','Tellurium','127.60','metalloid'],
    [53,'I','Iodine','126.90','halogen'],[54,'Xe','Xenon','131.29','noble'],
    [55,'Cs','Caesium','132.91','alkali'],[56,'Ba','Barium','137.33','alkaline'],
    [57,'La','Lanthanum','138.91','lanthanide'],[58,'Ce','Cerium','140.12','lanthanide'],
    [59,'Pr','Praseodymium','140.91','lanthanide'],[60,'Nd','Neodymium','144.24','lanthanide'],
    [61,'Pm','Promethium','[145]','lanthanide'],[62,'Sm','Samarium','150.36','lanthanide'],
    [63,'Eu','Europium','151.96','lanthanide'],[64,'Gd','Gadolinium','157.25','lanthanide'],
    [65,'Tb','Terbium','158.93','lanthanide'],[66,'Dy','Dysprosium','162.50','lanthanide'],
    [67,'Ho','Holmium','164.93','lanthanide'],[68,'Er','Erbium','167.26','lanthanide'],
    [69,'Tm','Thulium','168.93','lanthanide'],[70,'Yb','Ytterbium','173.05','lanthanide'],
    [71,'Lu','Lutetium','174.97','lanthanide'],[72,'Hf','Hafnium','178.49','transition'],
    [73,'Ta','Tantalum','180.95','transition'],[74,'W','Tungsten','183.84','transition'],
    [75,'Re','Rhenium','186.21','transition'],[76,'Os','Osmium','190.23','transition'],
    [77,'Ir','Iridium','192.22','transition'],[78,'Pt','Platinum','195.08','transition'],
    [79,'Au','Gold','196.97','transition'],[80,'Hg','Mercury','200.59','transition'],
    [81,'Tl','Thallium','204.38','post'],[82,'Pb','Lead','207.2','post'],
    [83,'Bi','Bismuth','208.98','post'],[84,'Po','Polonium','[209]','post'],
    [85,'At','Astatine','[210]','halogen'],[86,'Rn','Radon','[222]','noble'],
    [87,'Fr','Francium','[223]','alkali'],[88,'Ra','Radium','[226]','alkaline'],
    [89,'Ac','Actinium','[227]','actinide'],[90,'Th','Thorium','232.04','actinide'],
    [91,'Pa','Protactinium','231.04','actinide'],[92,'U','Uranium','238.03','actinide'],
    [93,'Np','Neptunium','[237]','actinide'],[94,'Pu','Plutonium','[244]','actinide'],
    [95,'Am','Americium','[243]','actinide'],[96,'Cm','Curium','[247]','actinide'],
    [97,'Bk','Berkelium','[247]','actinide'],[98,'Cf','Californium','[251]','actinide'],
    [99,'Es','Einsteinium','[252]','actinide'],[100,'Fm','Fermium','[257]','actinide'],
    [101,'Md','Mendelevium','[258]','actinide'],[102,'No','Nobelium','[259]','actinide'],
    [103,'Lr','Lawrencium','[266]','actinide'],[104,'Rf','Rutherfordium','[267]','transition'],
    [105,'Db','Dubnium','[268]','transition'],[106,'Sg','Seaborgium','[269]','transition'],
    [107,'Bh','Bohrium','[270]','transition'],[108,'Hs','Hassium','[269]','transition'],
    [109,'Mt','Meitnerium','[278]','unknown'],[110,'Ds','Darmstadtium','[281]','unknown'],
    [111,'Rg','Roentgenium','[282]','unknown'],[112,'Cn','Copernicium','[285]','transition'],
    [113,'Nh','Nihonium','[286]','post'],[114,'Fl','Flerovium','[289]','post'],
    [115,'Mc','Moscovium','[290]','post'],[116,'Lv','Livermorium','[293]','post'],
    [117,'Ts','Tennessine','[294]','halogen'],[118,'Og','Oganesson','[294]','noble']
  ],

  catNames: {
    alkali:'Alkali metal', alkaline:'Alkaline earth metal', transition:'Transition metal',
    post:'Post-transition metal', metalloid:'Metalloid', nonmetal:'Non-metal',
    halogen:'Halogen', noble:'Noble gas', lanthanide:'Lanthanide', actinide:'Actinide',
    unknown:'Properties unknown'
  },

  /* ---- valencies: [formula, name, valency/charge, also-known-as] ---- */
  ions: {
    cations: [
      ['H^+','Hydrogen',1,''], ['Na^+','Sodium',1,''], ['K^+','Potassium',1,''],
      ['Ag^+','Silver',1,''], ['Li^+','Lithium',1,''], ['NH_4^+','Ammonium',1,''],
      ['Cu^+','Copper(I)',1,'Cuprous'], ['Hg_2^{2+}','Mercury(I)',1,'Mercurous'],
      ['Au^+','Gold(I)',1,'Aurous'],
      ['Mg^{2+}','Magnesium',2,''], ['Ca^{2+}','Calcium',2,''], ['Ba^{2+}','Barium',2,''],
      ['Zn^{2+}','Zinc',2,''], ['Fe^{2+}','Iron(II)',2,'Ferrous'], ['Cu^{2+}','Copper(II)',2,'Cupric'],
      ['Pb^{2+}','Lead(II)',2,'Plumbous'], ['Sn^{2+}','Tin(II)',2,'Stannous'],
      ['Hg^{2+}','Mercury(II)',2,'Mercuric'], ['Mn^{2+}','Manganese(II)',2,''],
      ['Ni^{2+}','Nickel(II)',2,''], ['Co^{2+}','Cobalt(II)',2,''],
      ['Al^{3+}','Aluminium',3,''], ['Fe^{3+}','Iron(III)',3,'Ferric'],
      ['Cr^{3+}','Chromium(III)',3,''], ['Au^{3+}','Gold(III)',3,'Auric'],
      ['Pb^{4+}','Lead(IV)',4,'Plumbic'], ['Sn^{4+}','Tin(IV)',4,'Stannic']
    ],
    anions: [
      ['F^-','Fluoride',1,''], ['Cl^-','Chloride',1,''], ['Br^-','Bromide',1,''],
      ['I^-','Iodide',1,''], ['OH^-','Hydroxide',1,''], ['NO_3^-','Nitrate',1,''],
      ['NO_2^-','Nitrite',1,''], ['HCO_3^-','Hydrogencarbonate',1,'Bicarbonate'],
      ['HSO_4^-','Hydrogensulphate',1,'Bisulphate'], ['ClO_3^-','Chlorate',1,''],
      ['ClO^-','Hypochlorite',1,''], ['MnO_4^-','Permanganate',1,''],
      ['CH_3COO^-','Acetate',1,'Ethanoate'], ['CN^-','Cyanide',1,''],
      ['H^-','Hydride',1,''], ['AlO_2^-','Aluminate',1,''],
      ['O^{2-}','Oxide',2,''], ['S^{2-}','Sulphide',2,''], ['SO_4^{2-}','Sulphate',2,''],
      ['SO_3^{2-}','Sulphite',2,''], ['CO_3^{2-}','Carbonate',2,''],
      ['CrO_4^{2-}','Chromate',2,''], ['Cr_2O_7^{2-}','Dichromate',2,''],
      ['SiO_3^{2-}','Silicate',2,''], ['C_2O_4^{2-}','Oxalate',2,''],
      ['S_2O_3^{2-}','Thiosulphate',2,''], ['O_2^{2-}','Peroxide',2,''],
      ['N^{3-}','Nitride',3,''], ['P^{3-}','Phosphide',3,''],
      ['PO_4^{3-}','Phosphate',3,''], ['PO_3^{3-}','Phosphite',3,''],
      ['BO_3^{3-}','Borate',3,''], ['[Fe(CN)_6]^{3-}','Ferricyanide',3,'']
    ]
  },

  /* ---- formulas ----
     sub: maths | physics | chemistry
     cls: classes where this typically appears (a guide — chapter order
          differs between boards, the formula does not)              */
  formulas: [

    /* ================= MATHS ================= */
    { sub:'maths', ch:'Mensuration — plane figures', cls:[5,6,7,8], items:[
      { n:'Perimeter of a rectangle', f:'P = 2(l + b)', v:[['l','length'],['b','breadth']] },
      { n:'Area of a rectangle', f:'A = l × b' },
      { n:'Perimeter of a square', f:'P = 4a', v:[['a','side']] },
      { n:'Area of a square', f:'A = a^2' },
      { n:'Area of a triangle', f:'A = ½ × b × h', v:[['b','base'],['h','height']] },
      { n:'Area of a parallelogram', f:'A = b × h' },
      { n:'Area of a trapezium', f:'A = ½ (a + b) h', v:[['a, b','parallel sides'],['h','distance between them']] },
      { n:'Area of a rhombus', f:'A = ½ d_1 d_2', v:[['d_1, d_2','diagonals']] },
      { n:'Circumference of a circle', f:'C = 2πr' },
      { n:'Area of a circle', f:'A = πr^2' },
      { n:'Length of an arc', f:'l = (θ/360°) × 2πr', v:[['θ','angle at centre']] },
      { n:'Area of a sector', f:'A = (θ/360°) × πr^2' }
    ]},
    { sub:'maths', ch:'Mensuration — solids', cls:[8,9,10], items:[
      { n:'Volume of a cuboid', f:'V = l × b × h' },
      { n:'Surface area of a cuboid', f:'S = 2(lb + bh + hl)' },
      { n:'Volume of a cube', f:'V = a^3' },
      { n:'Surface area of a cube', f:'S = 6a^2' },
      { n:'Volume of a cylinder', f:'V = πr^2 h' },
      { n:'Curved surface area of a cylinder', f:'CSA = 2πrh' },
      { n:'Total surface area of a cylinder', f:'TSA = 2πr(r + h)' },
      { n:'Volume of a cone', f:'V = ⅓ πr^2 h' },
      { n:'Curved surface area of a cone', f:'CSA = πrl', v:[['l','slant height, l = √(r² + h²)']] },
      { n:'Total surface area of a cone', f:'TSA = πr(l + r)' },
      { n:'Volume of a sphere', f:'V = (4/3) πr^3' },
      { n:'Surface area of a sphere', f:'S = 4πr^2' },
      { n:'Volume of a hemisphere', f:'V = (2/3) πr^3' },
      { n:'Total surface area of a hemisphere', f:'TSA = 3πr^2' },
      { n:'Volume of a frustum', f:'V = ⅓ πh(R^2 + r^2 + Rr)', cls:[10] },
      { n:"Heron's formula", f:'A = √(s(s−a)(s−b)(s−c))', v:[['s','semi-perimeter, s = (a+b+c)/2']], note:'Use when you know all three sides but no height.', cls:[9] }
    ]},
    { sub:'maths', ch:'Exponents and powers', cls:[7,8,9], items:[
      { n:'Product rule', f:'a^m × a^n = a^{m+n}' },
      { n:'Quotient rule', f:'a^m ÷ a^n = a^{m−n}' },
      { n:'Power of a power', f:'(a^m)^n = a^{mn}' },
      { n:'Power of a product', f:'(ab)^m = a^m b^m' },
      { n:'Zero exponent', f:'a^0 = 1', note:'For any a ≠ 0.' },
      { n:'Negative exponent', f:'a^{−n} = 1 / a^n' },
      { n:'Fractional exponent', f:'a^{m/n} = ⁿ√(a^m)' }
    ]},
    { sub:'maths', ch:'Algebraic identities', cls:[8,9], items:[
      { n:'Square of a sum', f:'(a + b)^2 = a^2 + 2ab + b^2' },
      { n:'Square of a difference', f:'(a − b)^2 = a^2 − 2ab + b^2' },
      { n:'Difference of squares', f:'a^2 − b^2 = (a + b)(a − b)' },
      { n:'Product of binomials', f:'(x + a)(x + b) = x^2 + (a + b)x + ab' },
      { n:'Square of a trinomial', f:'(a + b + c)^2 = a^2 + b^2 + c^2 + 2ab + 2bc + 2ca', cls:[9] },
      { n:'Cube of a sum', f:'(a + b)^3 = a^3 + b^3 + 3ab(a + b)', cls:[9] },
      { n:'Cube of a difference', f:'(a − b)^3 = a^3 − b^3 − 3ab(a − b)', cls:[9] },
      { n:'Sum of cubes', f:'a^3 + b^3 = (a + b)(a^2 − ab + b^2)', cls:[9] },
      { n:'Difference of cubes', f:'a^3 − b^3 = (a − b)(a^2 + ab + b^2)', cls:[9] },
      { n:'Three-cube identity', f:'a^3 + b^3 + c^3 − 3abc = (a + b + c)(a^2 + b^2 + c^2 − ab − bc − ca)', note:'If a + b + c = 0, then a³ + b³ + c³ = 3abc.', cls:[9] }
    ]},
    { sub:'maths', ch:'Commercial mathematics', cls:[7,8], items:[
      { n:'Simple interest', f:'SI = (P × R × T) / 100', v:[['P','principal'],['R','rate % p.a.'],['T','time in years']] },
      { n:'Amount (compound interest)', f:'A = P(1 + R/100)^n', v:[['n','number of compounding periods']] },
      { n:'Compound interest', f:'CI = A − P' },
      { n:'Profit percentage', f:'Profit % = (Profit / CP) × 100' },
      { n:'Loss percentage', f:'Loss % = (Loss / CP) × 100' },
      { n:'Discount', f:'Discount = MP − SP', v:[['MP','marked price'],['SP','selling price']] },
      { n:'Percentage change', f:'% change = ((new − old) / old) × 100' },
      { n:'Speed', f:'Speed = Distance / Time' }
    ]},
    { sub:'maths', ch:'Polynomials', cls:[9,10], items:[
      { n:'Remainder theorem', f:'p(x) ÷ (x − a) leaves remainder p(a)' },
      { n:'Factor theorem', f:'(x − a) is a factor of p(x) ⟺ p(a) = 0' },
      { n:'Quadratic: sum of zeroes', f:'α + β = −b/a', note:'For ax² + bx + c = 0.' },
      { n:'Quadratic: product of zeroes', f:'αβ = c/a' },
      { n:'Cubic: relations', f:'α+β+γ = −b/a,  αβ+βγ+γα = c/a,  αβγ = −d/a', note:'For ax³ + bx² + cx + d = 0.' }
    ]},
    { sub:'maths', ch:'Quadratic equations', cls:[10,11], items:[
      { n:'Quadratic formula', f:'x = (−b ± √(b^2 − 4ac)) / 2a' },
      { n:'Discriminant', f:'D = b^2 − 4ac' },
      { n:'Nature of roots', f:'D > 0: two distinct real  ·  D = 0: two equal real  ·  D < 0: no real roots' }
    ]},
    { sub:'maths', ch:'Arithmetic and geometric progressions', cls:[10,11], items:[
      { n:'AP — nth term', f:'a_n = a + (n − 1)d' },
      { n:'AP — sum of n terms', f:'S_n = (n/2) [2a + (n − 1)d]' },
      { n:'AP — sum using last term', f:'S_n = (n/2)(a + l)', v:[['l','last term']] },
      { n:'GP — nth term', f:'a_n = a r^{n−1}', cls:[11] },
      { n:'GP — sum of n terms', f:'S_n = a(r^n − 1) / (r − 1)', note:'For r ≠ 1.', cls:[11] },
      { n:'GP — sum to infinity', f:'S_{∞} = a / (1 − r)', note:'Only when |r| < 1.', cls:[11] },
      { n:'Sum of first n naturals', f:'Σn = n(n + 1) / 2' },
      { n:'Sum of first n squares', f:'Σn^2 = n(n + 1)(2n + 1) / 6', cls:[11] },
      { n:'Sum of first n cubes', f:'Σn^3 = [n(n + 1) / 2]^2', cls:[11] }
    ]},
    { sub:'maths', ch:'Coordinate geometry', cls:[9,10,11], items:[
      { n:'Distance formula', f:'d = √((x_2 − x_1)^2 + (y_2 − y_1)^2)' },
      { n:'Midpoint formula', f:'M = ((x_1 + x_2)/2, (y_1 + y_2)/2)' },
      { n:'Section formula (internal)', f:'P = ((mx_2 + nx_1)/(m+n), (my_2 + ny_1)/(m+n))' },
      { n:'Centroid of a triangle', f:'G = ((x_1+x_2+x_3)/3, (y_1+y_2+y_3)/3)' },
      { n:'Area of a triangle', f:'A = ½ |x_1(y_2 − y_3) + x_2(y_3 − y_1) + x_3(y_1 − y_2)|' },
      { n:'Slope of a line', f:'m = (y_2 − y_1) / (x_2 − x_1) = tan θ', cls:[11] },
      { n:'Slope–intercept form', f:'y = mx + c', cls:[11] },
      { n:'Point–slope form', f:'y − y_1 = m(x − x_1)', cls:[11] },
      { n:'Distance of a point from a line', f:'d = |Ax_1 + By_1 + C| / √(A^2 + B^2)', cls:[11] },
      { n:'Parallel and perpendicular lines', f:'Parallel: m_1 = m_2   ·   Perpendicular: m_1 m_2 = −1', cls:[11] }
    ]},
    { sub:'maths', ch:'Trigonometry', cls:[10,11], items:[
      { n:'Basic ratios', f:'sin θ = P/H,  cos θ = B/H,  tan θ = P/B', v:[['P','perpendicular'],['B','base'],['H','hypotenuse']] },
      { n:'Reciprocal ratios', f:'cosec θ = 1/sin θ,  sec θ = 1/cos θ,  cot θ = 1/tan θ' },
      { n:'Quotient identity', f:'tan θ = sin θ / cos θ' },
      { n:'Pythagorean identity', f:'sin^2 θ + cos^2 θ = 1' },
      { n:'Secant identity', f:'1 + tan^2 θ = sec^2 θ' },
      { n:'Cosecant identity', f:'1 + cot^2 θ = cosec^2 θ' },
      { n:'Complementary angles', f:'sin(90° − θ) = cos θ,  tan(90° − θ) = cot θ' },
      { n:'Standard values — sin', f:'sin 0° = 0,  sin 30° = ½,  sin 45° = 1/√2,  sin 60° = √3/2,  sin 90° = 1' },
      { n:'Standard values — cos', f:'cos 0° = 1,  cos 30° = √3/2,  cos 45° = 1/√2,  cos 60° = ½,  cos 90° = 0' },
      { n:'Standard values — tan', f:'tan 0° = 0,  tan 30° = 1/√3,  tan 45° = 1,  tan 60° = √3,  tan 90° = ∞' },
      { n:'Compound angle — sine', f:'sin(A ± B) = sin A cos B ± cos A sin B', cls:[11] },
      { n:'Compound angle — cosine', f:'cos(A ± B) = cos A cos B ∓ sin A sin B', cls:[11] },
      { n:'Compound angle — tangent', f:'tan(A ± B) = (tan A ± tan B) / (1 ∓ tan A tan B)', cls:[11] },
      { n:'Double angle — sine', f:'sin 2A = 2 sin A cos A', cls:[11] },
      { n:'Double angle — cosine', f:'cos 2A = cos^2 A − sin^2 A = 2cos^2 A − 1 = 1 − 2sin^2 A', cls:[11] },
      { n:'Double angle — tangent', f:'tan 2A = 2 tan A / (1 − tan^2 A)', cls:[11] },
      { n:'Sine rule', f:'a/sin A = b/sin B = c/sin C = 2R', cls:[11] },
      { n:'Cosine rule', f:'c^2 = a^2 + b^2 − 2ab cos C', cls:[11] }
    ]},
    { sub:'maths', ch:'Permutations, combinations and binomial', cls:[11], items:[
      { n:'Factorial', f:'n! = n × (n−1) × … × 2 × 1', note:'0! = 1.' },
      { n:'Permutations', f:'^nP_r = n! / (n − r)!', note:'Order matters.' },
      { n:'Combinations', f:'^nC_r = n! / (r! (n − r)!)', note:'Order does not matter.' },
      { n:'Symmetry of combinations', f:'^nC_r = ^nC_{n−r}' },
      { n:'Binomial theorem', f:'(a + b)^n = Σ ^nC_r a^{n−r} b^r' },
      { n:'General term', f:'T_{r+1} = ^nC_r a^{n−r} b^r' }
    ]},
    { sub:'maths', ch:'Statistics and probability', cls:[9,10,11], items:[
      { n:'Mean (ungrouped)', f:'x̄ = Σx_i / n' },
      { n:'Mean (grouped, direct)', f:'x̄ = Σf_i x_i / Σf_i' },
      { n:'Mean (assumed mean)', f:'x̄ = a + Σf_i d_i / Σf_i', v:[['d_i','x_i − a']] },
      { n:'Mode (grouped)', f:'Mode = l + [(f_1 − f_0) / (2f_1 − f_0 − f_2)] × h', cls:[10] },
      { n:'Median (grouped)', f:'Median = l + [(n/2 − cf) / f] × h', cls:[10] },
      { n:'Empirical relation', f:'3 Median = Mode + 2 Mean', cls:[10] },
      { n:'Variance', f:'σ^2 = Σ(x_i − x̄)^2 / n', cls:[11] },
      { n:'Standard deviation', f:'σ = √(Σ(x_i − x̄)^2 / n)', cls:[11] },
      { n:'Probability of an event', f:'P(E) = favourable outcomes / total outcomes', note:'0 ≤ P(E) ≤ 1.' },
      { n:'Complement', f:'P(not E) = 1 − P(E)' },
      { n:'Addition rule', f:'P(A ∪ B) = P(A) + P(B) − P(A ∩ B)', cls:[11] },
      { n:'Conditional probability', f:'P(A | B) = P(A ∩ B) / P(B)', cls:[12] },
      { n:"Bayes' theorem", f:'P(A_i | B) = P(A_i) P(B | A_i) / Σ P(A_j) P(B | A_j)', cls:[12] }
    ]},
    { sub:'maths', ch:'Calculus — derivatives', cls:[11,12], items:[
      { n:'Definition', f:'f′(x) = lim_{h→0} [f(x + h) − f(x)] / h' },
      { n:'Power rule', f:'d/dx (x^n) = n x^{n−1}' },
      { n:'Product rule', f:'(uv)′ = u′v + uv′' },
      { n:'Quotient rule', f:'(u/v)′ = (u′v − uv′) / v^2' },
      { n:'Chain rule', f:'dy/dx = (dy/du)(du/dx)' },
      { n:'Trig derivatives', f:'d/dx(sin x) = cos x,  d/dx(cos x) = −sin x,  d/dx(tan x) = sec^2 x' },
      { n:'Exponential and log', f:'d/dx(e^x) = e^x,  d/dx(ln x) = 1/x,  d/dx(a^x) = a^x ln a' }
    ]},
    { sub:'maths', ch:'Calculus — integrals', cls:[12], items:[
      { n:'Power rule', f:'∫ x^n dx = x^{n+1} / (n + 1) + C', note:'For n ≠ −1.' },
      { n:'Reciprocal', f:'∫ (1/x) dx = ln|x| + C' },
      { n:'Exponential', f:'∫ e^x dx = e^x + C' },
      { n:'Trig integrals', f:'∫ sin x dx = −cos x + C,  ∫ cos x dx = sin x + C,  ∫ sec^2 x dx = tan x + C' },
      { n:'Integration by parts', f:'∫ u v dx = u ∫v dx − ∫ (u′ ∫v dx) dx', note:'Choose u by ILATE.' },
      { n:'Fundamental theorem', f:'∫_a^b f(x) dx = F(b) − F(a)' },
      { n:'Area under a curve', f:'A = ∫_a^b y dx' }
    ]},
    { sub:'maths', ch:'Vectors and 3D geometry', cls:[12], items:[
      { n:'Magnitude', f:'|a⃗| = √(a_1^2 + a_2^2 + a_3^2)' },
      { n:'Dot product', f:'a⃗ · b⃗ = |a⃗||b⃗| cos θ = a_1b_1 + a_2b_2 + a_3b_3' },
      { n:'Cross product magnitude', f:'|a⃗ × b⃗| = |a⃗||b⃗| sin θ' },
      { n:'Perpendicular test', f:'a⃗ · b⃗ = 0' },
      { n:'Distance between two points (3D)', f:'d = √((x_2−x_1)^2 + (y_2−y_1)^2 + (z_2−z_1)^2)' },
      { n:'Direction cosines', f:'l^2 + m^2 + n^2 = 1' }
    ]},

    /* ================= PHYSICS ================= */
    { sub:'physics', ch:'Measurement and basics', cls:[6,7,8,9], items:[
      { n:'Speed', f:'v = s / t', v:[['s','distance'],['t','time']] },
      { n:'Average speed', f:'v_avg = total distance / total time' },
      { n:'Velocity', f:'v⃗ = displacement / time', note:'Velocity has direction; speed does not.' },
      { n:'Acceleration', f:'a = (v − u) / t' },
      { n:'Density', f:'ρ = m / V' },
      { n:'Relative density', f:'RD = density of substance / density of water', note:'It has no unit.' },
      { n:'Pressure', f:'P = F / A' },
      { n:'Pressure in a liquid', f:'P = hρg' }
    ]},
    { sub:'physics', ch:'Motion', cls:[9,11], items:[
      { n:'First equation of motion', f:'v = u + at' },
      { n:'Second equation of motion', f:'s = ut + ½at^2' },
      { n:'Third equation of motion', f:'v^2 = u^2 + 2as' },
      { n:'Distance in the nth second', f:'s_n = u + (a/2)(2n − 1)' },
      { n:'Projectile — time of flight', f:'T = 2u sin θ / g', cls:[11] },
      { n:'Projectile — maximum height', f:'H = u^2 sin^2 θ / 2g', cls:[11] },
      { n:'Projectile — range', f:'R = u^2 sin 2θ / g', note:'Range is maximum at θ = 45°.', cls:[11] },
      { n:'Centripetal acceleration', f:'a_c = v^2 / r = ω^2 r', cls:[11] }
    ]},
    { sub:'physics', ch:'Force, motion and momentum', cls:[9,11], items:[
      { n:"Newton's second law", f:'F = ma' },
      { n:'Momentum', f:'p = mv' },
      { n:'Force as rate of change of momentum', f:'F = Δp / Δt' },
      { n:'Impulse', f:'J = FΔt = Δp' },
      { n:'Conservation of momentum', f:'m_1u_1 + m_2u_2 = m_1v_1 + m_2v_2' },
      { n:'Friction', f:'f = μN', v:[['μ','coefficient of friction'],['N','normal reaction']], cls:[11] },
      { n:'Torque', f:'τ = r F sin θ', cls:[11] },
      { n:'Angular momentum', f:'L = Iω', cls:[11] }
    ]},
    { sub:'physics', ch:'Gravitation', cls:[9,11], items:[
      { n:'Universal law of gravitation', f:'F = G m_1 m_2 / r^2', v:[['G','6.674 × 10⁻¹¹ N m² kg⁻²']] },
      { n:'Acceleration due to gravity', f:'g = GM / R^2', note:'≈ 9.8 m s⁻² at Earth\u2019s surface.' },
      { n:'Weight', f:'W = mg' },
      { n:'Escape velocity', f:'v_e = √(2GM / R) = √(2gR)', note:'≈ 11.2 km s⁻¹ for Earth.', cls:[11] },
      { n:'Orbital velocity', f:'v_o = √(GM / r)', cls:[11] },
      { n:'Gravitational potential energy', f:'U = −GMm / r', cls:[11] }
    ]},
    { sub:'physics', ch:'Work, energy and power', cls:[9,11], items:[
      { n:'Work', f:'W = F s cos θ' },
      { n:'Kinetic energy', f:'KE = ½ m v^2' },
      { n:'Potential energy (gravitational)', f:'PE = mgh' },
      { n:'Work–energy theorem', f:'W_net = ΔKE', cls:[11] },
      { n:'Power', f:'P = W / t = F v' },
      { n:'Relation between KE and momentum', f:'KE = p^2 / 2m', cls:[11] },
      { n:'Efficiency', f:'η = (useful output / total input) × 100%' }
    ]},
    { sub:'physics', ch:'Fluids and elasticity', cls:[9,11], items:[
      { n:"Archimedes' principle", f:'Upthrust = weight of fluid displaced' },
      { n:'Buoyant force', f:'F_b = V ρ g' },
      { n:'Stress', f:'σ = F / A', cls:[11] },
      { n:'Strain', f:'ε = ΔL / L', cls:[11] },
      { n:"Young's modulus", f:'Y = stress / strain = FL / AΔL', cls:[11] },
      { n:'Equation of continuity', f:'A_1v_1 = A_2v_2', cls:[11] },
      { n:"Bernoulli's principle", f:'P + ½ρv^2 + ρgh = constant', cls:[11] }
    ]},
    { sub:'physics', ch:'Heat and thermodynamics', cls:[11], items:[
      { n:'Heat gained or lost', f:'Q = mcΔT', v:[['c','specific heat capacity']] },
      { n:'Latent heat', f:'Q = mL' },
      { n:'Linear expansion', f:'ΔL = L α ΔT' },
      { n:'First law of thermodynamics', f:'ΔU = Q − W' },
      { n:'Ideal gas equation', f:'PV = nRT', v:[['R','8.314 J mol⁻¹ K⁻¹']] },
      { n:'RMS speed of gas molecules', f:'v_rms = √(3RT / M)' },
      { n:'Efficiency of a heat engine', f:'η = 1 − T_2 / T_1' }
    ]},
    { sub:'physics', ch:'Oscillations and waves', cls:[9,11], items:[
      { n:'Wave equation', f:'v = f λ' },
      { n:'Frequency and time period', f:'f = 1 / T' },
      { n:'Echo — distance', f:'2d = v × t' },
      { n:'SHM — displacement', f:'x = A sin(ωt + φ)', cls:[11] },
      { n:'Time period of a simple pendulum', f:'T = 2π √(L / g)', cls:[11] },
      { n:'Time period of a spring', f:'T = 2π √(m / k)', cls:[11] },
      { n:'Beat frequency', f:'f_beat = |f_1 − f_2|', cls:[11] }
    ]},
    { sub:'physics', ch:'Light and optics', cls:[10,12], items:[
      { n:'Mirror formula', f:'1/v + 1/u = 1/f' },
      { n:'Magnification (mirror)', f:'m = −v / u = h′ / h' },
      { n:'Focal length of a spherical mirror', f:'f = R / 2' },
      { n:'Lens formula', f:'1/v − 1/u = 1/f' },
      { n:'Magnification (lens)', f:'m = v / u' },
      { n:'Power of a lens', f:'P = 1 / f', note:'f in metres; P in dioptres (D).' },
      { n:'Refractive index', f:'n = c / v = sin i / sin r' },
      { n:"Snell's law", f:'n_1 sin i = n_2 sin r' },
      { n:'Critical angle', f:'sin C = 1 / n' },
      { n:'Lens maker formula', f:'1/f = (n − 1)(1/R_1 − 1/R_2)', cls:[12] },
      { n:'Lenses in contact', f:'1/F = 1/f_1 + 1/f_2', cls:[12] },
      { n:"Young's double slit — fringe width", f:'β = λD / d', cls:[12] }
    ]},
    { sub:'physics', ch:'Electricity', cls:[10,12], items:[
      { n:'Electric current', f:'I = Q / t' },
      { n:"Ohm's law", f:'V = IR' },
      { n:'Resistance of a conductor', f:'R = ρ l / A' },
      { n:'Resistors in series', f:'R_s = R_1 + R_2 + R_3 + …' },
      { n:'Resistors in parallel', f:'1/R_p = 1/R_1 + 1/R_2 + 1/R_3 + …' },
      { n:'Electric power', f:'P = VI = I^2 R = V^2 / R' },
      { n:'Heating effect (Joule\u2019s law)', f:'H = I^2 R t' },
      { n:'Electrical energy', f:'E = P × t', note:'1 kWh = 3.6 × 10⁶ J.' },
      { n:"Coulomb's law", f:'F = k q_1 q_2 / r^2', v:[['k','9 × 10⁹ N m² C⁻²']], cls:[12] },
      { n:'Electric field', f:'E = F / q = kq / r^2', cls:[12] },
      { n:'Electric potential', f:'V = W / q = kq / r', cls:[12] },
      { n:'Capacitance', f:'C = Q / V', cls:[12] },
      { n:'Energy stored in a capacitor', f:'U = ½ CV^2', cls:[12] }
    ]},
    { sub:'physics', ch:'Magnetism and EMI', cls:[10,12], items:[
      { n:'Force on a current-carrying conductor', f:'F = BIL sin θ' },
      { n:'Force on a moving charge', f:'F = qvB sin θ', cls:[12] },
      { n:"Faraday's law of induction", f:'ε = −N dΦ / dt', cls:[12] },
      { n:'Magnetic flux', f:'Φ = BA cos θ', cls:[12] },
      { n:'Transformer relation', f:'V_s / V_p = N_s / N_p', cls:[12] },
      { n:'Speed of light from constants', f:'c = 1 / √(μ_0 ε_0)', cls:[12] }
    ]},
    { sub:'physics', ch:'Modern physics', cls:[12], items:[
      { n:'Energy of a photon', f:'E = hν = hc / λ', v:[['h','6.626 × 10⁻³⁴ J s']] },
      { n:'Photoelectric equation', f:'hν = φ + KE_max' },
      { n:'de Broglie wavelength', f:'λ = h / p = h / mv' },
      { n:'Mass–energy equivalence', f:'E = mc^2' },
      { n:'Bohr radius', f:'r_n = 0.529 n^2 / Z  Å' },
      { n:'Energy of hydrogen levels', f:'E_n = −13.6 / n^2  eV' },
      { n:'Radioactive decay law', f:'N = N_0 e^{−λt}' },
      { n:'Half-life', f:'t_{1/2} = 0.693 / λ' }
    ]},

    /* ================= CHEMISTRY ================= */
    { sub:'chemistry', ch:'Mole concept', cls:[9,11], items:[
      { n:'Number of moles from mass', f:'n = m / M', v:[['m','given mass (g)'],['M','molar mass (g mol⁻¹)']] },
      { n:'Number of particles', f:'N = n × N_A', v:[['N_A','6.022 × 10²³ mol⁻¹']] },
      { n:'Molar volume at STP', f:'V = n × 22.4 L', note:'At 273 K and 1 atm.' },
      { n:'Percentage composition', f:'% element = (mass of element / molar mass) × 100' },
      { n:'Molecular formula', f:'Molecular formula = n × Empirical formula', v:[['n','molar mass ÷ empirical formula mass']], cls:[11] }
    ]},
    { sub:'chemistry', ch:'Gas laws', cls:[9,11], items:[
      { n:"Boyle's law", f:'P_1V_1 = P_2V_2', note:'At constant temperature.' },
      { n:"Charles' law", f:'V_1 / T_1 = V_2 / T_2', note:'At constant pressure; T in kelvin.' },
      { n:'Gay-Lussac law', f:'P_1 / T_1 = P_2 / T_2', note:'At constant volume.' },
      { n:'Combined gas law', f:'P_1V_1 / T_1 = P_2V_2 / T_2' },
      { n:'Ideal gas equation', f:'PV = nRT' },
      { n:"Dalton's law of partial pressures", f:'P_total = P_1 + P_2 + P_3 + …', cls:[11] },
      { n:'Kelvin conversion', f:'K = °C + 273.15' }
    ]},
    { sub:'chemistry', ch:'Acids, bases and salts', cls:[10,11], items:[
      { n:'pH', f:'pH = −log[H^+]' },
      { n:'pOH', f:'pOH = −log[OH^−]' },
      { n:'Relation between pH and pOH', f:'pH + pOH = 14', note:'At 25 °C.' },
      { n:'Ionic product of water', f:'K_w = [H^+][OH^−] = 10^{−14}', note:'At 25 °C.' },
      { n:'Neutral, acidic, basic', f:'pH = 7 neutral  ·  pH < 7 acidic  ·  pH > 7 basic' },
      { n:'Dilution', f:'M_1V_1 = M_2V_2' }
    ]},
    { sub:'chemistry', ch:'Solutions', cls:[11,12], items:[
      { n:'Molarity', f:'M = moles of solute / volume of solution (L)' },
      { n:'Molality', f:'m = moles of solute / mass of solvent (kg)' },
      { n:'Mole fraction', f:'x_A = n_A / (n_A + n_B)' },
      { n:'Mass percentage', f:'% = (mass of solute / mass of solution) × 100' },
      { n:"Raoult's law", f:'P = P_A^0 x_A + P_B^0 x_B', cls:[12] },
      { n:'Elevation of boiling point', f:'ΔT_b = K_b m', cls:[12] },
      { n:'Depression of freezing point', f:'ΔT_f = K_f m', cls:[12] },
      { n:'Osmotic pressure', f:'π = CRT', cls:[12] }
    ]},
    { sub:'chemistry', ch:'Thermodynamics and equilibrium', cls:[11], items:[
      { n:'First law', f:'ΔU = q + w' },
      { n:'Enthalpy', f:'H = U + PV' },
      { n:'Enthalpy change', f:'ΔH = ΔU + Δn_g RT' },
      { n:'Gibbs free energy', f:'ΔG = ΔH − TΔS', note:'ΔG < 0 means spontaneous.' },
      { n:'Equilibrium constant', f:'K_c = [products] / [reactants]', note:'Each raised to its stoichiometric coefficient.' },
      { n:'Relation between Kp and Kc', f:'K_p = K_c (RT)^{Δn}' }
    ]},
    { sub:'chemistry', ch:'Electrochemistry and kinetics', cls:[12], items:[
      { n:'Gibbs energy and cell potential', f:'ΔG° = −nFE°_cell', v:[['F','96500 C mol⁻¹']] },
      { n:'Nernst equation', f:'E = E° − (0.059/n) log Q', note:'At 298 K.' },
      { n:"Faraday's first law", f:'m = ZIt' },
      { n:'Conductivity', f:'κ = G × (l / A)' },
      { n:'Rate of reaction', f:'rate = −Δ[R] / Δt = +Δ[P] / Δt' },
      { n:'First-order rate constant', f:'k = (2.303 / t) log([R]_0 / [R])' },
      { n:'Half-life (first order)', f:'t_{1/2} = 0.693 / k' },
      { n:'Arrhenius equation', f:'k = A e^{−E_a / RT}' }
    ]},
    { sub:'chemistry', ch:'Atomic structure', cls:[9,11], items:[
      { n:'Atomic number', f:'Z = number of protons' },
      { n:'Mass number', f:'A = protons + neutrons' },
      { n:'Number of neutrons', f:'n = A − Z' },
      { n:'Maximum electrons in a shell', f:'2n^2', v:[['n','shell number']] },
      { n:'Rydberg formula', f:'1/λ = R(1/n_1^2 − 1/n_2^2)', v:[['R','1.097 × 10⁷ m⁻¹']], cls:[11] },
      { n:'Number of orbitals in a subshell', f:'2l + 1', cls:[11] }
    ]}
  ]
};
