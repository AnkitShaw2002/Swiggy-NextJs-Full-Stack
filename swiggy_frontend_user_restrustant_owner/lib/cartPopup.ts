import Swal from "sweetalert2";

/**
 * Bottom-sheet confirmation shown before the first item of a new restaurant
 * is added while the cart still holds items from another restaurant.
 * Resolves `true` only when the user picks "YES, START AFRESH".
 */
export const showClearCartPopup = async (
  cartRestaurantName?: string,
  newRestaurantName?: string
): Promise<boolean> => {
  const result = await Swal.fire({
    title: "Items already in cart",
    text: `Your cart contains items from ${
      cartRestaurantName || "another restaurant"
    }. Would you like to reset your cart for adding items from ${
      newRestaurantName || "this restaurant"
    }?`,
    icon: undefined,
    showCancelButton: true,
    confirmButtonText: "YES, START AFRESH",
    cancelButtonText: "NO",
    reverseButtons: false,
    position: "bottom",
    toast: false,
    customClass: {
      container: "swal2-cart-sheet",
      popup:
        "w-full max-w-2xl rounded-t-2xl rounded-b-none p-6 bg-white shadow-2xl flex flex-col items-start text-left mb-0",
      title: "text-xl font-bold text-gray-900 mb-2 p-0",
      htmlContainer: "text-gray-600 text-sm mb-6 m-0 text-left",
      actions: "w-full flex gap-4 mt-0 p-0",
      confirmButton:
        "flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg shadow-none focus:ring-0 m-0 order-2",
      cancelButton:
        "flex-1 bg-white hover:bg-gray-50 text-emerald-600 border border-emerald-600 font-semibold py-3 px-4 rounded-lg shadow-none focus:ring-0 m-0 order-1",
    },
    buttonsStyling: false,
    showClass: {
      popup: "animate__animated animate__slideInUp animate__faster",
    },
    hideClass: {
      popup: "animate__animated animate__slideOutDown animate__faster",
    },
  });

  return result.isConfirmed;
};
