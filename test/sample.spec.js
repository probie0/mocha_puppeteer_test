describe('add todo', function () {
    let page;
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    before (async function () {
      page = await browser.newPage();
      await page.goto('http://127.0.0.1:3000', {delay:3000});
    });
  
    after (async function () {
      await page.close();
    });

    it('should have correct title', async function() {
        expect(await page.title()).to.eql('Todo List Demo');
    })
    it('should new todo correct', async function() {
        const inputText = 'new todo item';
      await page.click('#add-item input', {delay: 500});
      await page.type('#add-item input', inputText, {delay: 50});
      await page.focus('#add-item input')
      await page.keyboard.press("Enter",{delay: 500});
      const todoItem = await page.waitForSelector('#todo-list:last-child');
      let expectInputContent = await page.evaluate(todoItem => todoItem.querySelector("span").textContent, todoItem);
      expectInputContent = expectInputContent.slice(0, expectInputContent.length - 1);
      expect(expectInputContent).to.eql(inputText);
    }) 

    it('should render all the item', async function(){
      for(let i = 0; i < 3; i++){
        await page.click('#add-item input', {delay: 500});
        await page.type('#add-item input', 'new todo item'+i, {delay: 50});
        await page.focus('#add-item input')
        await page.keyboard.press("Enter",{delay: 500});
      }
      await delay(2000);
      let todoList = await page.waitForSelector('#todo-list');
      const itemNum = await page.evaluate(todoList => todoList.childElementCount-1, todoList);
      expect(itemNum).to.eql(4);
    })


    it('should change the status of item to \'completed\'', async function(){
      let todoItem = await page.waitForSelector('#todo-list:last-child');
      let checkBtn = await todoItem.$('.done-btn');
      await checkBtn.click();
      await delay(1000);
      const status = await page.evaluate(todoItem => todoItem.querySelector("span").className, todoItem);
      expect(status).to.eql('done-item');
    })

    it('should delete the item', async function(){
      const todoItem = await page.waitForSelector('#todo-list:last-child');
      const deleteBtn = await todoItem.$('.del-btn');
      const item_id = await page.evaluate(todoItem => todoItem.getAttribute('itemid'), todoItem);
      await todoItem.hover();
      await deleteBtn.click();
      await delay(2000);
      let todoItemDeleted = await page.$('#todo-list[itemID=\'' + item_id + '\']');
      expect(todoItemDeleted).to.eql(null);
    })





});