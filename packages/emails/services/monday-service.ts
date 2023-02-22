import initMondayClient from 'monday-sdk-js';

class MondayService {

  static async runQuery(token: string, query: string, vars: object) {
    const mondayClient = initMondayClient();
    mondayClient.setToken(token);
    return await mondayClient.api(query, { vars });
  }

  static async getCurrentUser(token: string) {
    const query = "query{ me { id name email account { id } } }";
    try{
      const response = await this.runQuery(token, query, {});
      console.log(response);
      return response.data.me;
    }
    catch(err){
      console.log(err)
      return null;
    }
  }

  static async getItem(token: string, boardId: number, itemId: number) {
    console.log("GetItem", boardId, itemId);
    const query = `query {
      boards(ids:${boardId}){
        items(ids:${itemId}){
          name
          column_values {
            id
            text
          }
        }
      }
    }`;

    try{
      const response = await this.runQuery(token, query, {});
      return response.data.boards[0].items[0]
    }catch(error){
      console.log(error);
      return null;
    }
  }

  
  static async getAllColumns(token: string){
    
    const query = `query { boards { columns { title }}}`
    let response;
    try{
      response = await this.runQuery(token, query, {});
    }catch(err){
      console.log(err);
      return [];
    }
    console.log(response);

    let columns = [];
    response.data.boards.forEach((board) => {
      columns = columns.concat(board.columns.map(col => col.title));
    });

    return Array.from(new Set(columns));

  }

  static async getAccountId(token: string) {
    console.log(token);
    const query = `query { users { id, name } }`

    console.log("************************************************ 1")
    const mondayClient = initMondayClient();
    console.log("************************************************ 2")
    mondayClient.setToken(token);
    console.log("************************************************ 3")
    try{
      mondayClient.api(query).then(res => console.log(res));
      console.log("************************************************ 4")
    }
    catch (err) {
      console.log(err);
    }
    
    console.log("************************************************ 5")
    
    
  }

  static async getColumnValue(token, itemId, columnId) {
    console.log(itemId, columnId);
    try {
      const mondayClient = initMondayClient();
      mondayClient.setToken(token);

      const query = `query($itemId: [Int], $columnId: [String]) {
        items (ids: $itemId) {
          column_values(ids:$columnId) {
            value
          }
        }
      }`;
      const variables = { columnId, itemId };

      const response = await mondayClient.api(query, { variables });
      console.log(response.data);
      return response.data.items[0].column_values[0].value.replace(/"/g, "");
    } catch (err) {
      console.log(err);
    }
  }

  static async changeColumnValue(token, boardId, itemId, columnId, value) {
    try {
      const mondayClient = initMondayClient({ token });

      const query = `mutation change_column_value($boardId: Int!, $itemId: Int!, $columnId: String!, $value: JSON!) {
        change_column_value(board_id: $boardId, item_id: $itemId, column_id: $columnId, value: $value) {
          id
        }
      }
      `;
      const variables = { boardId, columnId, itemId, value };

      const response = await mondayClient.api(query, { variables });
      return response;
    } catch (err) {
      console.log(err);
    }
  }
}

export default MondayService;
