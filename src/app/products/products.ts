import { Component } from '@angular/core';
import { PRODUCT_LIST } from './products.config';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {
  searchText = '';
  selectedCategory = 'All';
  selectedRating = 0;
  maxPrice = 999999;
  sortBy = 'none';

  products: any[] = PRODUCT_LIST.map((p: any) => ({
    ...p,
    views: 0,
    bestSeller: p.bestSeller ?? false,
    newArrival: p.newArrival ?? false,
  }));

  wishlist: any[] = [];
  cart: any[] = [];
  recentlyViewed: any[] = [];
  compareList: any[] = [];
  quickViewProduct: any = null;
  toastMsg = '';

  constructor() {
    const savedCart = localStorage.getItem('cart');
    const savedWish = localStorage.getItem('wishlist');
    const savedRecent = localStorage.getItem('recentlyViewed');

    if (savedCart) this.cart = JSON.parse(savedCart);
    if (savedWish) this.wishlist = JSON.parse(savedWish);
    if (savedRecent) this.recentlyViewed = JSON.parse(savedRecent);
  }

  showToast(msg: string) {
    this.toastMsg = msg;
    setTimeout(() => (this.toastMsg = ''), 2000);
  }

  toggleWishlist(item: any) {
    const index = this.wishlist.findIndex((p) => p.id === item.id);
    if (index >= 0) {
      this.wishlist.splice(index, 1);
      this.showToast('Removed from Wishlist');
    } else {
      this.wishlist.push(item);
      this.showToast('Added to Wishlist ❤️');
    }
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
  }

  isWishlisted(item: any) {
    return this.wishlist.some((w) => w.id === item.id);
  }

  addRecentlyViewed(p: any) {
    p.views++;
    const exists = this.recentlyViewed.find((x) => x.id === p.id);
    if (!exists) {
      this.recentlyViewed.unshift(p);
      if (this.recentlyViewed.length > 8) this.recentlyViewed.pop();
    }
    localStorage.setItem('recentlyViewed', JSON.stringify(this.recentlyViewed));
  }

  addToCart(product: any) {
    const existing = this.cart.find((c) => c.id === product.id);
    if (existing) existing.qty++;
    else this.cart.push({ ...product, qty: 1 });
    this.showToast('Added to Cart 🛒');
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  increaseQty(item: any) {
    item.qty++;
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  decreaseQty(item: any) {
    if (item.qty > 1) item.qty--;
    else this.cart = this.cart.filter((c) => c.id !== item.id);
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  clearCart() {
    this.cart = [];
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.showToast('Cart Cleared');
  }

  get cartTotal() {
    return this.cart.reduce(
      (sum, item) => sum + (item.price - (item.price * item.discount) / 100) * item.qty,
      0
    );
  }

  get filteredProducts() {
    let data = this.products.filter(
      (p) =>
        p.name.toLowerCase().includes(this.searchText.toLowerCase()) &&
        (this.selectedCategory === 'All' || p.cat === this.selectedCategory) &&
        p.price <= this.maxPrice &&
        p.rating >= this.selectedRating
    );

    if (this.sortBy === 'lh') data = data.sort((a, b) => a.price - b.price);
    if (this.sortBy === 'hl') data = data.sort((a, b) => b.price - a.price);
    if (this.sortBy === 'az') data = data.sort((a, b) => a.name.localeCompare(b.name));
    if (this.sortBy === 'popularity') data = data.sort((a, b) => b.views - a.views);
    if (this.sortBy === 'rating') data = data.sort((a, b) => b.rating - a.rating);
    if (this.sortBy === 'newest') data = data.sort((a, b) => b.id - a.id);

    return data;
  }

  clearFilters() {
    this.searchText = '';
    this.selectedCategory = 'All';
    this.selectedRating = 0;
    this.maxPrice = 999999;
    this.sortBy = 'none';
  }

  toggleCompare(p: any) {
    const index = this.compareList.indexOf(p);
    if (index >= 0) {
      this.compareList.splice(index, 1);
      this.showToast('Removed from Compare');
    } else {
      if (this.compareList.length >= 3) {
        this.showToast('You can compare max 3 items');
        return;
      }
      this.compareList.push(p);
      this.showToast('Added to Compare ⚔');
    }
  }

  openQuickView(p: any) {
    this.quickViewProduct = p;
  }

  closeQuickView() {
    this.quickViewProduct = null;
  }

  animateAddToCart(p: any) {
    p.animating = true;
    setTimeout(() => (p.animating = false), 400);
  }
}
