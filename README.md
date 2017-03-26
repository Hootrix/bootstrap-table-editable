# bootstrap-table-editable
Bootstrap-table-editable modified version of the extension
Support for custom configuration X-editable

Bootstrap-table-editable扩展的修改版本：支持自定义配置`X-editable`

修改自：https://github.com/wenzhixin/bootstrap-table-examples/blob/master/extensions/editable.html  
##用法
```
<table
        data-client-sort="false"
        data-pagination="true"
        data-sort-name="id"
        data-side-pagination="server"
        data-url="admin/orderManagement/waiting"
        data-show-columns="true"
        data-page-size="10"
        data-page-list="[10, 25, 50, All]"
        data-unique-id="id"
        data-search="true"
    >
    <thead>
    <tr>
        <th data-editable-pang-custom-editable-option-function="editableOption" data-editable="true" data-field="waiter_id" data-width="80" >waiter_id</th>
    </tr>
    </thead>
</table>


<script type="application/javascript">
    //编辑框的配置
    var editableOption = function(){
        return {
            emptytext: '0.0',
            type: 'select',
            title: '部门',
            source:[
                {value:"1",text:"研发部"},
                {value:"2",text:"销售部"},
                {value:"3",text:"行政部"}
            ]
        };
    }
</script>
```
