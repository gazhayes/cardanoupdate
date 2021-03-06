import './research.html'
import './research.scss'

import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'

const CHUNK_SIZE = 3

Template.research.onCreated(function () {
    this.sort = new ReactiveVar('date-desc')
    this.searchFilter = new ReactiveVar('')
    
    this.autorun(() => {
        this.subscribe('research')
    })
})

Template.research.helpers({
    chunkSize: () => CHUNK_SIZE + 1,
    canEdit: function() {
        return this.createdBy === Meteor.userId()
    },

    isDateAsc() {
        return Template.instance().sort.get() === 'date-asc'
    },

    searchArgs() {
        const instance = Template.instance();
        return {
            placeholder: TAPi18n.__('research.main.search'),
            type: 'research',
            onChange: (newTerm) => instance.searchFilter.set(newTerm),
        }
    },
    resultArgs() {
        return {
            types: ['research'],
            searchTerm: Template.instance().searchFilter.get(),
            doLanguageGrouping: true,
            languages: Meteor.user() && Meteor.user().profile && Meteor.user().profile.contentLanguages,
        }
    },
})

Template.research.events({
    'click #new-research': (event, _) => {
        event.preventDefault()
        FlowRouter.go('/research/new')
    },
    'click #sort-date': (event, templateInstance) => {
        event.preventDefault()
        if (templateInstance.sort.get() === 'date-desc') {
            templateInstance.sort.set('date-asc');
        } else {
            templateInstance.sort.set('date-desc');
        }
    },
})
