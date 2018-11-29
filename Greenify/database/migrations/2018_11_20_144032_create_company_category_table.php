<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCompanyCategoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('company_category', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->unsignedInteger('category_id');
            $table->unsignedInteger('company_id');
            $table->foreign('category_id')->references('id')->on('ch_categories');
            $table->foreign('company_id')->references('id')->on('companies');
            $table->index(['category_id','company_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('company_category');
    }
}
