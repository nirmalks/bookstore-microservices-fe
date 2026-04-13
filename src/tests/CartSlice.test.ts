import cartReducer, { addItem, removeItem, editItem, clearCart } from '../features/cart/cartSlice';
jest.spyOn(console, 'error').mockImplementation(() => { });
describe('Cart Slice Tests', () => {
  const mockBook = {
    id: 1,
    title: 'Test Book',
    price: 1000,
    quantity: 1,
    stock: 10,
    imagePath: 'test.jpg',
    publishedDate: '2023',
    genreIds: [1, 2],
    authorIds: [102],
    isbn: '978-0123456789'
  };
  const initialState = {
    cartItems: [],
    numItemsInCart: 0,
    cartTotal: 0,
    shipping: 500,
    tax: 0,
    orderTotal: 0,
  };

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    jest.resetModules();
  });

  test('should hydrate state from localStorage if valid data exists', () => {
    const validCart = {
      cartItems: [],
      numItemsInCart: 0,
      cartTotal: 100,
      shipping: 50,
      tax: 10,
      orderTotal: 160,
    };
    localStorage.setItem('cart', JSON.stringify(validCart));

    // 2. REQUIRE the reducer inside the test so it reads localStorage NOW
    const freshReducer = require('../features/cart/cartSlice').default;
    const state = freshReducer(undefined, { type: '@@INIT' });

    expect(state.cartTotal).toBe(100);
  });

  test('should trigger catch block and console.error on invalid JSON', () => {
    localStorage.setItem('cart', 'invalid-json-{');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    // Force re-execution of the file
    const freshReducer = require('../features/cart/cartSlice').default;
    freshReducer(undefined, { type: '@@INIT' });

    expect(consoleSpy).toHaveBeenCalledWith('Cart hydration error:', expect.any(Error));
    consoleSpy.mockRestore();
  });
  test('should initialize with defaultState when localStorage is empty', () => {
    // Passing undefined triggers the slice's internal initialState logic
    const state = cartReducer(undefined, { type: '@@INIT' });

    expect(state.cartItems).toHaveLength(0);
    expect(state.shipping).toBe(50);
  });

  test('should return defaultState if Zod validation fails', () => {
    const invalidData = { cartItems: "not-an-array" };
    localStorage.setItem('cart', JSON.stringify(invalidData));

    const state = cartReducer(undefined, { type: '@@INIT' });
    expect(state.cartItems).toHaveLength(0);
  });

  test('should handle addItem to empty cart', () => {
    const action = addItem({ book: mockBook });
    const state = cartReducer(initialState, action);

    expect(state.cartItems).toHaveLength(1);
    expect(state.cartItems[0].id).toBe(1);
    expect(state.numItemsInCart).toBe(1);
    expect(state.cartTotal).toBe(1000);
  });

  test('should handle addItem to existing cart (increment quantity)', () => {
    // Start with 1 item already in cart
    const startState = {
      ...initialState,
      cartItems: [{ ...mockBook, quantity: 1 }],
      numItemsInCart: 1,
      cartTotal: 1000
    };

    const action = addItem({ book: mockBook });
    const state = cartReducer(startState, action);

    expect(state.cartItems).toHaveLength(1);
    expect(state.cartItems[0].quantity).toBe(2);
    expect(state.numItemsInCart).toBe(2);
  });

  test('should handle removeItem', () => {
    const startState = {
      ...initialState,
      cartItems: [mockBook],
      numItemsInCart: 1,
      cartTotal: 1000
    };

    const action = removeItem({ id: 1 });
    const state = cartReducer(startState, action);

    expect(state.cartItems).toHaveLength(0);
    expect(state.numItemsInCart).toBe(0);
  });

  test('removeItem should not change state if book is not found', () => {
    const startState = {
      ...initialState,
      cartItems: [mockBook],
      numItemsInCart: 1,
      cartTotal: 1000
    };

    const action = removeItem({ id: 2 });
    const state = cartReducer(startState, action);

    expect(state.cartItems).toHaveLength(1);
    expect(state.numItemsInCart).toBe(1);
    expect(state.cartTotal).toBe(1000);
  });

  test('should handle editItem (update quantity)', () => {
    const startState = {
      ...initialState,
      cartItems: [mockBook],
      numItemsInCart: 1,
      cartTotal: 1000
    };

    const action = editItem({ id: 1, quantity: 5 });
    const state = cartReducer(startState, action);

    expect(state.cartItems[0].quantity).toBe(5);
    expect(state.numItemsInCart).toBe(5);
  });

  test('should handle clearCart', () => {
    const startState = {
      ...initialState,
      cartItems: [mockBook],
      numItemsInCart: 1
    };

    const state = cartReducer(startState, clearCart());
    expect(state.cartItems).toHaveLength(0);
    expect(state.numItemsInCart).toBe(0);
  });

  test('should correctly calculate totals (tax, shipping, orderTotal)', () => {
    const action = addItem({ book: mockBook }); // Price 1000
    const state = cartReducer(initialState, action);

    // If your tax is 10%: 10% of 1000 = 100
    // Total = 1000 (cart) + 500 (shipping) + 100 (tax) = 1600
    expect(state.tax).toBe(100);
    expect(state.orderTotal).toBe(1600);
  });

});