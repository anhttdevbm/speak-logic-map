export const markerFnIndex = [1];
export const markerPersonIndex = [1];
export const markerProblemIndex = [1];
export const unitDistance = ['mile'];
export const markerHouseIndex = [1];
export const markerCountryFnIndex = [1];
export const groupCountryFnIndex = [1];
export const groupFnIndex = [1];
export const groupPersonIndex = [1];
export const mainsetIndex = [1];
export const functionSelected = [];
export const personSelected = [];
export const defaultFunction = ["20"];
export const defaultPerson = ["20"];
export const defaultFunctionPerson = ["20"];
export const textPath = [];
export let selectedList = [];
export const allLayer = [];

window.eFunction = [1];
window.aFunction = [1];
window.natural = [1];
window.nonNatural = [1];
window.addedFunction = [1];
window.existingFunction = [1];
window.UnT = [1];
window.HnT = [1];

export const handleName = (name: string, index: number[], currentName: string) => {
  if (name && index) {
    return `${name} ${index[0]++}`;
  }
  else if (name) {
    return name;
  }
  else if (!name && !index) {
    return currentName; 
  }
}
