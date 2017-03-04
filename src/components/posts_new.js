import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import {createPost} from '../actions/index';
import {Link} from 'react-router';

const FIELDS = {
    title: {//key
        type: 'input',
        label: 'Title for Post'
    },
    categories: {
        type: 'input',
        label: 'Enter some categories for this post'
    },
    content: {
        type: 'textarea',
        label: 'Post Contents'
    }
};

class PostsNew extends Component {

    static contextTypes = { //Should only be used when working with router.
        router: PropTypes.object
    };
    onSubmit(props){
        this.props.createPost(props)
            .then(() => {
                //blog post created. navigate user to index
                this.context.router.push('/');
            });
    }
    renderField(fieldConfig, field){
        const fieldHelper = this.props.fields[field];
        return (
            <div key={fieldConfig.label} className={`form-group ${fieldHelper.touched && fieldHelper.invalid ? 'has-danger' : ''}`}>
                <label>{fieldConfig.label}</label>
                <fieldConfig.type type="text" className="form-control" {...fieldHelper}/>
                <div className="text-help">
                    {fieldHelper.touched ? fieldHelper.error : ''}
                </div>
            </div>
        );
    }
    render(){
        //const {fields: {title, categories, content}, handleSubmit} = this.props;
        const {handleSubmit} = this.props;

        return(
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                <h3>Create A New Post</h3>
                {_.map(FIELDS, this.renderField.bind(this))}
                <button type="submit" className="btn btn-primary">Submit</button>
                <Link to="/" className="btn btn-danger">Cancel</Link>
            </form>
        );
    }
}

//returned object matches a fields key from the form. It will show in form.
function validate(values){
    const errors = {};

    _.each(FIELDS, (type,field) => {
        if(!values[field]){
            errors[field] = `Enter a ${field}`
        }
    });

    return errors;
}

//connect: first arg is mapStateToProps, 2nd is mapDispatchToProps
//reduxForm: 1st is form config, 2nd is mapStateToProps, 3rs is mapDispatchToProps

export default reduxForm({
    form: 'PostsNewForm',
    fields: _.keys(FIELDS),
    validate
}, null, {createPost})(PostsNew);

//when user types something in.. record it on application state