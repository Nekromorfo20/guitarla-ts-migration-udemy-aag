import { db } from "../data/db"
import { TCartItem, TGuitar } from "../types"

export type TCartActions =
     { type: "add-to-cart", payload: { item: TGuitar } } |
     { type: "remove-from-cart", payload: { id: TGuitar['id'] } } |
     { type: "decrease-quantity", payload: { id: TGuitar['id'] } } |
     { type: "increase-quantity", payload: { id: TGuitar['id'] } } |
     { type: "clear-cart" }

export type TCartState = {
    data : TGuitar[],
    cart : TCartItem[]
}

const initialCart  = () : TCartItem[] => {
    const localStorageCart = localStorage.getItem("cart")
    return localStorageCart ? JSON.parse(localStorageCart) : []
  }

export const initialState : TCartState = {
    data: db,
    cart: initialCart()
}

const MAX_ITEMS = 5
const MIN_ITEMS = 1

export const cartReducer = (
    state : TCartState = initialState,
    action : TCartActions
) => {
    if (action.type === "add-to-cart") {

        const itemExist = state.cart.find(guitar => guitar.id === action.payload.item.id)
        let updatedCart : TCartItem[] = []

        if (itemExist) { // Existe el item en el carrito
          updatedCart = state.cart.map(item => {
            if (item.id === action.payload.item.id) {
                if (item.quantity < MAX_ITEMS) {
                    return {
                        ...item, quantity: item.quantity + 1
                    }
                } else {
                    return item
                }
            } else {
                return item
            }
          })
        } else {
          const newItem : TCartItem = { ...action.payload.item, quantity: 1 }
          updatedCart = [...state.cart, newItem]
        }

        return {
            ...state,
            cart: updatedCart
        }
    }

    if (action.type === "remove-from-cart") {
        const cart = state.cart.filter(item => item.id !== action.payload.id)
        return {
            ...state,
            cart
        }
    }

    if (action.type === "decrease-quantity") {
        const cart = state.cart.map(item => {
            if (item.id === action.payload.id && item.quantity > MIN_ITEMS) {
              return {
                ...item,
                quantity: item.quantity - 1
              }
            }
            return item
          })

        return {
            ...state,
            cart
        }
    }

    if (action.type === "increase-quantity") {
        const cart = state.cart.map(item => {
            if (item.id === action.payload.id && item.quantity < MAX_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })

        return {
            ...state,
            cart
        }
    }

    if (action.type === "clear-cart") {
        return {
            ...state,
            cart: []
        }
    }

    return state
}