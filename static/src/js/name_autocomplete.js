/** @odoo-module **/

import { CharField } from "@web/views/fields/char/char_field";
import { AutoComplete } from "@web/core/autocomplete/autocomplete";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { Component, markup, useEffect, useRef, useState } from "@odoo/owl";

export class NameAutocomplete extends AutoComplete {
    static template = "bits_electronics.NameAutocomplete";
    
    static props = {
        ...AutoComplete.props,
        onSelect: { type: Function, optional: true }, // Định nghĩa thuộc tính onSelect
    };
    setup() {
        super.setup();
        this.inputRef = useRef("input");
        this.sourcesListRef = useRef("sourcesList");
        this.orm = useService("orm");
        this.props.sources = [
            {
                options: async () => {
                    console.log("Current value:", this.props.value);
                    const domain = [['name', 'ilike', this.props.value || '']];
                    const fields = ['name'];
                    const records = await this.orm.searchRead('product.template', domain, fields, { limit: 10 });
                    console.log("Records from ORM:", records);
                    return records.map((record) => ({
                        value: record.name || "",
                        label: record.name || "",
                    }));
                },
            },
        ];
    }
    /**
     * @override
     */
    async onInput(ev) {
        console.log("Custom AutoComplete triggered");
        console.log("Input event value:", ev.target.value);
        await super.onInput(ev);
        console.log("Dropdown open state:", this.state.open);
    }
    /**
     * @override
     */
    selectOption(option, params = {}) {
        console.log("Option selected:", option);
        if (this.inputRef && this.inputRef.el) {
            this.inputRef.el.value = option.value;
        }
        if (typeof this.props.onSelect === "function") {
            this.props.onSelect(option.value, {
                ...params,
                input: this.inputRef ? this.inputRef.el : null,
            });
        }
        this.close();
    }
    externalClose(ev) {
        if (!this.root || !this.root.el) {
            return;
        }
        if (!this.root.el.contains(ev.target)) {
            this.close();
        }
    }
}

registry.category("fields").add("name_autocomplete", {component: NameAutocomplete});