describe('add todo', function () {
    let page;
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    before (async function () {
      page = await browser.newPage();
      await page.goto('http://127.0.0.1:7001/');
    });
  
    after (async function () {
      await page.close();
    });

    it('should have correct title', async function() {
        expect(await page.title()).to.eql('demo');
    })
    it('should new todo correct', async function() {
      await page.click('#new-todo', {delay: 500});
      await page.type('#new-todo', 'new todo item', {delay: 50});
      await page.keyboard.press("Enter");
      let todoList = await page.waitForSelector('#todo-list');
      const expectInputContent = await page.evaluate(todoList => todoList.lastChild.querySelector('label').textContent, todoList);
      expect(expectInputContent).to.eql('new todo item');
    }) 

    it('should render all the item', async function(){
      for(let i = 0; i < 3; i++){
        await page.click('#new-todo', {delay: 500});
        await page.type('#new-todo', 'new todo item', {delay: 50});
        await page.keyboard.press("Enter");
      }
      let todoList = await page.waitForSelector('#todo-list');
      const itemNum = await page.evaluate(todoList => todoList.childElementCount, todoList);
      expect(itemNum).to.eql(4);
    })


    it('should change the status of item to \'completed\'', async function(){
      let todoItem = await page.waitForSelector('#todo-list li:last-child');
      let checkBtn = await todoItem.$('input.toggle');
      await checkBtn.click();
      await delay(1000);
      const status = await page.evaluate(todoItem => todoItem.className, todoItem);
      expect(status).to.eql('completed');
    })

    it('should delete the item', async function(){
      let todoList = await page.waitForSelector('#todo-list');
      let todoItem = await todoList.$('li:last-child');
      let deleteBtn = await todoItem.$('button');
      let react_id = await page.evaluate(todoItem => todoItem.getAttribute('data-reactid'), todoItem);
      await todoItem.hover();
      await deleteBtn.click();
      await delay(2000);
      let todoItemDeleted = await page.$('#todo-list li[data-reactid=\'' + react_id + '\']');
      expect(todoItemDeleted).to.eql(null);
    })




});