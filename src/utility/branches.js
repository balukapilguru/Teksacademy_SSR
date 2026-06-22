// All 9 Teks Academy Branches
export const BRANCHES = [
  {
    name: "Ameerpet",
    value: "Ameerpet",
    phone: "+91 78159 24610",
  },
  {
    name: "Hitec City",
    value: "Hitec City",
    phone: "+91 78159 24622",
  },
  {
    name: "Secunderabad",
    value: "Secunderabad",
    phone: "+91 92814 66365",
  },
  {
    name: "Dilsukhnagar",
    value: "Dilsukhnagar",
    phone: "+91 78159 24700",
  },
  {
    name: "Mehdipatnam",
    value: "Mehdipatnam",
    phone: "+91 98660 47567",
  },
  {
    name: "Kukatpally",
    value: "Kukatpally",
    phone: "+91 86884 08352",
  },
  {
    name: "Bangalore",
    value: "Bangalore",
    phone: "+91 70754 63275",
  },
  {
    name: "Visakhapatnam",
    value: "Visakhapatnam",
    phone: "+91 91333 08352",
  },
  // {
  //   name: "Salem",
  //   value: "Salem",
  //   phone: "+91 97885 77788",
  // },
  {
    name: "Kompally",
    value: "Kompally",
    phone: "+91 720765 7474",
  }
];

export const BRANCH_OPTIONS = BRANCHES.map((b) => ({
  label: b.name,
  value: b.value,
}));
