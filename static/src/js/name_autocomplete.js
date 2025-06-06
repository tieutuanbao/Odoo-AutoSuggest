/** @odoo-module **/

import { CharField } from "@web/views/fields/char/char_field";
import { AutoComplete } from "@web/core/autocomplete/autocomplete";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";

export class NameAutocomplete extends AutoComplete {
    static template = "bits_electronics.NameAutocomplete";
    
    static props = {
        ...AutoComplete.props,
        onSelect: { type: Function, optional: true }, // Định nghĩa thuộc tính onSelect
    };
    setup() {
        super.setup();
        this.orm = useService("orm");
        this.props.sources = [
            {
                options: async () => {
                    console.log("Current value:", this.props.value);
                    const domain = [['name', 'ilike', this.props.value || '']];
                    const fields = ['name'];
                    const records = await this.orm.searchRead('product.template', domain, fields, { limit: 10 });
                    return records.map((record) => ({
                        label: record.name || "No Name",
                        value: record.name || "",
                    }));
                },
            },
        ];
    }
    mounted() {
        // Gán class cho input sau khi render
        if (this.inputRef && this.inputRef.el) {
            this.inputRef.el.classList.add("o_input o_field_translate");
        }
    }
    /**
     * @override
     */
    async onInput(ev) {
        console.log("Custom AutoComplete triggered");
        this.props.value = ev.target.value; // Cập nhật giá trị
        await super.onInput(ev);
    }
    /**
     * @override
     */
    selectOption(option, params = {}) {
        console.log("Option selected:", option); // Log kiểm tra
        // this.inputRef.el.value = option.value; // Gán giá trị cho trường Product Name
        // this.props.onSelect?.(option, {
        //     ...params,
        //     input: this.inputRef.el,
        // });
        // this.close(); // Đóng danh sách gợi ý
        if (typeof this.props.onSelect === "function") {
            this.props.onSelect(option.value, {
                ...params,
                input: this.inputRef.el,
            });
        }
        this.close();
    }
}

registry.category("fields").add("name_autocomplete", {component: NameAutocomplete});