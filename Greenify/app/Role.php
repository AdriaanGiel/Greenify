<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable = [
        'name'
    ];

    function users()
    {
        return $this->hasMany(User::class);
    }
}
