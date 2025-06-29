import { test } from '../fixtures/fixtures';
import { expect } from '@playwright/test';
import { el, faker } from '@faker-js/faker';
import * as helper from '../Helpers/helper'

test(' Test Case 1: Login and Verify Product Page', async ({pm,page}) => {
  //Step 1: Assert the current URL is https://www.saucedemo.com/inventory.html
  expect(page.url()).toBe('https://www.saucedemo.com/inventory.html')
  //Step 2: Assert that 3 products are visible on the page
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible()
  await expect(page.getByText('Sauce Labs Fleece Jacket')).toBeVisible()
  await expect(page.getByText('Sauce Labs Onesie')).toBeVisible()

  //Log Out
  await pm.basePage().logOut()
  await pm.basePage().closeTab()
});

test('Test Case 2: Add Two Items to Cart and Verify Cart Count', async({pm})=>{
  //Step 1: On the inventory page, click Add to cart for Sauce Labs Backpack
  await pm.productPage().addProductToCart('Sauce Labs Backpack')
  //Step 2: Click Add to cart for Sauce Labs Bike Light
  await pm.productPage().addProductToCart('Sauce Labs Bike Light')
  //Step 3: Verify the cart icon shows 2 items
  expect(await pm.productPage().shoppingCartBadge().textContent()).toBe('2')
  //Step 4: Click on the cart icon
  await pm.productPage().clickCartLink()
  //Step 5: Verify both products are listed in the cart
  const cartItems = await pm.cardPage().getCartItems()
  expect(cartItems).toEqual(['Sauce Labs Backpack','Sauce Labs Bike Light'])

  //Log Out and close window
  await pm.basePage().logOut()
  await pm.basePage().closeTab()
})

test('Test Case 3: Remove Item from Cart', async ({pm}) => {
  //Step 1: Add Sauce Labs Backpack and Sauce Labs Bike Light products to the cart
  await pm.productPage().addProductToCart('Sauce Labs Backpack')
  await pm.productPage().addProductToCart('Sauce Labs Bike Light')
  //Step 2: Click the cart icon to open the cart page
  await pm.productPage().clickCartLink()
  //Step 3: Click Remove button for Sauce Labs Backpack
  await pm.cardPage().removeProductFromCardList('Sauce Labs Backpack')
  //Step 4: Verify Sauce Labs Backpack is no longer in the cart
  //Step 4: Verify Sauce Labs Bike Light remains in the cart
  const remainingItemsInTheCard = await pm.cardPage().getCartItems()
  expect(remainingItemsInTheCard).toEqual(['Sauce Labs Bike Light'])
  //Step 5: Verify the cart icon now shows 1 item
  const cardIconBadgeNumber = await pm.productPage().shoppingCartBadge().textContent()
  expect(cardIconBadgeNumber).toEqual('1')

   //Log Out and close window
  await pm.basePage().logOut()
  await pm.basePage().closeTab()
})

test('Test Case 4: Complete a Checkout Flow Successfully', async ({page,pm}) => {
  //Step 1: Login and add Sauce Labs Fleece Jacket to the cart
  await pm.productPage().addProductToCart('Sauce Labs Fleece Jacket')
  //Step 2: Get product's price
  const productPriceAtProductPage = await page.locator('.inventory_item',{hasText: 'Sauce Labs Fleece Jacket'}).locator('.inventory_item_price').textContent()
  //Step 3: Go to the cart page and click Checkout
  await pm.productPage().clickCartLink()
  await pm.cardPage().checkout()
  //Step 4:Enter first name, last name, and postal code
  const randomFirstName = faker.person.firstName();
  const randomLastName = faker.person.lastName()
  const randomZipCode = faker.location.zipCode()
  await pm.checkoutPage().fillForm(randomFirstName,randomLastName,randomZipCode)
  //Step 5: Click Continue
  await pm.checkoutPage().clickContinue()
  //Step 6: Verify product and total price are correct on the overview page
  const productPriceAtCheckoutPage = await page.locator('.cart_item',{hasText: 'Sauce Labs Fleece Jacket'}).locator('.inventory_item_price').textContent()
  expect(productPriceAtProductPage).toEqual(productPriceAtCheckoutPage)
  //Step 7: Click Finish and verify the success message THANK YOU FOR YOUR ORDER
  await pm.checkoutPage().clickFinish()
  await expect(page.getByText('Thank you for your order!')).toBeVisible()
  await pm.checkoutPage().clickBackHome()

   //Log Out and close window
  await pm.basePage().logOut()
  await pm.basePage().closeTab()
})

test('Test Case 5: Logout and Prevent Back Navigation', async ({page,pm}) => {
  //Step 1: Click the burger menu (☰) on the top-left
  await pm.productPage().clickHamburgerMenu()
  //Step 2: Click Logout
  await pm.productPage().clickLogOut()
  //Step 3: Verify the login page is displayed
  await expect(page.getByRole('button', {name: 'login'})).toBeVisible()
  //Step 4: Press browser back button
  await page.goBack()
  //Step 5: Verify user is still on the login page and cannot access inventory page
  const errorMessage = page.getByText(`Epic sadface: You can only access '/inventory.html' when you are logged in.`)
  await expect(errorMessage).toBeVisible()

   //Log Out and close window
  await pm.basePage().closeTab()
})

test('Test Case 6: Sort Products by Price', async ({pm}) => {
  //Step 1: On the inventory page, select "Price (High to low)" from the sort dropdown
  await pm.productPage().filterProductsByOption('Price (high to low)')
  //Step 2: Capture all displayed product prices
  let productPricesStr = await pm.productPage().returnAllProductPrices()
  let productPrices = productPricesStr.map(price => parseFloat(price.replace(/[^0-9.]/g, '')));
  //Step 3: Verify the prices appear in descending order
  expect(helper.checkIfArraySortedDescending(productPrices)).toBeTruthy()
  //Step 4: On the inventory page, select "Price (Low to high)" from the sort dropdown
  await pm.productPage().filterProductsByOption('Price (low to high)')
  //Step 5: Capture all displayed product prices
  productPricesStr = await pm.productPage().returnAllProductPrices()
  productPrices = productPricesStr.map(price => parseFloat(price.replace(/[^0-9.]/g, '')));
  //Step 6: Verify the prices appear in Ascending order
  expect(helper.checkIfArraySortedAscending(productPrices)).toBeTruthy()

   //Log Out and close window
  await pm.basePage().logOut()
  await pm.basePage().closeTab()
})

test('Test Case 7: Add All Products and Complete Checkout', async ({page,pm}) => {
  //Step 1: Add all 6 products to the cart
  const allProductsInProductPage = await page.locator('.inventory_item_name').allTextContents()
  for(let product of allProductsInProductPage){
    await pm.productPage().addProductToCart(product)
  }
  //Step 2: Go to the cart page and verify all items are listed
  await pm.productPage().clickCartLink()
  const allProductsInCartPage = await page.locator('.inventory_item_name').allTextContents()
  expect(allProductsInCartPage).toEqual(allProductsInProductPage)
  //Step 3: Click Checkout and enter valid personal info (first name, last name, ZIP)
  await pm.cardPage().checkout()
  const randomFirstName = faker.person.firstName();
  const randomLastName = faker.person.lastName()
  const randomZipCode = faker.location.zipCode()
  await pm.checkoutPage().fillForm(randomFirstName,randomLastName,randomZipCode)
  await pm.checkoutPage().clickContinue()
  //Step 4: On the checkout overview page a) Capture and sum all prices and b) Verify displayed item total matches expected value
  const productPricesCheckoutPageStr = await page.locator('.inventory_item_price').allTextContents()
  const productPricesCheckoutPage = productPricesCheckoutPageStr.map(priceStr =>
    parseFloat(priceStr.match(/\d+(\.\d+)?/)?.[0] || '0')
  );
  
  let pricesSum = 0
  for (let price of productPricesCheckoutPage){
    pricesSum = pricesSum + price
  }
  
  //here i verify that the total ammount before tax is as expected
  const itemTotalBeforeTaxStr = await page.locator('.summary_subtotal_label').textContent()
  const itemTotalBeforeTax = parseFloat(itemTotalBeforeTaxStr?.match(/\d+(\.\d+)?/)?.[0] || '0')
  expect(pricesSum).toEqual(itemTotalBeforeTax)

  //here i verify that the total ammount after tax is as expected
  const itemTotalAfterTax = itemTotalBeforeTax + itemTotalBeforeTax * helper.taxRate()
  const totalStr = await page.locator('.summary_total_label').textContent()
  const total = parseFloat(totalStr?.match(/\d+(\.\d+)?/)?.[0] || '0')  
  expect(parseFloat(itemTotalAfterTax.toFixed(2))).toEqual(total)
  //Step 5: Click Finish
  await pm.checkoutPage().clickFinish()
  //Step 6: Verify success message: "THANK YOU FOR YOUR ORDER"
  await expect(page.getByText('THANK YOU FOR YOUR ORDER')).toBeVisible()

   //Log Out and close window
  await pm.basePage().logOut()
  await pm.basePage().closeTab()
})


