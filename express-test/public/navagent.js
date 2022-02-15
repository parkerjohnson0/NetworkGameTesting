class NavAgent {

    heuristic(a,b){
        let distance=0;
        distance += abs(abs(a.r) - abs(b.r));
        distance += abs(abs(a.c) - abs(b.c));
        return distance;
    }
    
    removeFromArray(arr, elt) {
        // Could use indexOf here instead to be more efficient
        for (var i = arr.length - 1; i >= 0; i--) {
          if (arr[i] == elt) {
            arr.splice(i, 1);
          }
        }
      }


findSurroundings(start, distance){
    let openSet = [];
    let closedSet = [];
    openSet.push(start);


    while (openSet.length >0) {
        let current = openSet[0];
        let neighbors = current.neighbors;
        neighbors = neighbors.filter(neighbor => neighbor);
    for (let neighbor of neighbors){
        if (!closedSet.includes(neighbor) && !openSet.includes(neighbor)){
            if (this.heuristic(start, neighbor) <= distance){
                openSet.push(neighbor);
            }
        }
    }
    this.removeFromArray(openSet, current);
    closedSet.push(current);

}
closedSet.shift();
return closedSet;

}

findPath(start, end) {
    let openSet = [];
    let closedSet = [];
    let attempts = 0;

    openSet.push(start);
    let checkedTiles = [];
    checkedTiles.push(start);
    while (openSet.length > 0) {
        // Best next option
        let winner = 0;
        for (let i = 0; i < openSet.length; i++) {
          if (openSet[i].f <= openSet[winner].f) {
            winner = i;
          }
        }
        let current = openSet[winner];
    
        // Did I finish?
        if (current === end) {
            closedSet.push(current);
          break;
        }

        // Best option moves from openSet to closedSet
    this.removeFromArray(openSet, current);
    closedSet.push(current);

    // Check all the neighbors
    let neighbors = current.neighbors;
    neighbors = neighbors.filter(neighbor => neighbor.isPathable === true);
    for (let neighbor of neighbors) {
      // Valid next spot?
      if (!closedSet.includes(neighbor)) {
        let tempG = current.g + this.heuristic(neighbor, current);

        // Is this a better path than before?
        if (!openSet.includes(neighbor)){
            openSet.push(neighbor);
            checkedTiles.push(neighbor);
        }
        else if (tempG >= neighbor.g) {
            continue;
        }

          neighbor.g = tempG;
          neighbor.h = this.heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
      }
    }
    attempts+=1;
    // Uh oh, no solution
    if (attempts > 50) {
      return [];
    }
  }


  let path = [];
  let temp = closedSet[closedSet.length-1];

if (temp != goal){
  return [];
}

  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }
  path.reverse().shift();

  for (let tile of checkedTiles){
    tile.reset();
  }
  return path; 
}

}