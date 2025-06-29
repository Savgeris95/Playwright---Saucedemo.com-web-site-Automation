export function checkIfArraySortedDescending(arr: number[]){
  for(let i=0;i<arr.length - 1;i++){
    
    if(arr[i] < arr[i+1]){
      return false
    }
  }
  return true
}

export function checkIfArraySortedAscending(arr: number[]){
  for(let i=0;i<arr.length - 1;i++){
    
    if(arr[i] > arr[i+1]){
      return false
    }
  }
  return true
}

export function taxRate(){
    return 0.0800461857006
}
