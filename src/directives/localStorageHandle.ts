export function handleLocalStorage(action: 'set' | 'remove', val: string): void {
  if (action === 'set') {
   if (localStorage.getItem("nux-game-uid") === null) {
    localStorage.setItem("nux-game-uid", val)
   } else {
    localStorage.removeItem("nux-game-uid");
    localStorage.setItem("nux-game-uid", val)
   }
  } else if (action === 'remove') {
    localStorage.removeItem("nux-game-uid");
  }
}